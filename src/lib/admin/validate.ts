import { isIconKey } from "@/components/Icons";
import { fieldRule, isEditableLeaf } from "@/lib/admin/schema";

/**
 * Server-side validation for a single field edit.
 *
 * The client will be editing without anyone reviewing the change first, and a
 * bad value committed to `content/` breaks the production build for everyone.
 * So nothing is trusted from the form: the path must resolve to a leaf that
 * already exists, the new value must match the type that leaf already holds,
 * and — the backstop — the whole file's shape after the edit must be identical
 * to its shape before, at every other path. A save that would change the
 * structure of the file is rejected rather than committed.
 */
export const MAX_FIELD_LENGTH = 20_000;

export type ValidationError = { ok: false; error: string };
export type ValidationOk = {
  ok: true;
  /** The file, serialised exactly as it should be written. */
  json: string;
  /** null when the field was cleared. */
  value: string | null;
};

/** `"items.0.criteria.1.title"` → `["items","0","criteria","1","title"]`. */
export function parsePath(raw: string): string[] | null {
  if (!raw || raw.length > 400) return null;
  const parts = raw.split(".");
  if (parts.some((p) => p.length === 0 || !/^[A-Za-z0-9_-]+$/.test(p))) {
    return null;
  }
  return parts;
}

export function getAtPath(root: unknown, path: string[]): unknown {
  let node: unknown = root;
  for (const key of path) {
    if (node === null || typeof node !== "object") return undefined;
    if (Array.isArray(node)) {
      if (!/^\d+$/.test(key)) return undefined;
      node = node[Number(key)];
    } else {
      if (!Object.prototype.hasOwnProperty.call(node, key)) return undefined;
      node = (node as Record<string, unknown>)[key];
    }
  }
  return node;
}

function setAtPath(root: unknown, path: string[], value: unknown): unknown {
  const clone = JSON.parse(JSON.stringify(root));
  let node = clone;
  for (const key of path.slice(0, -1)) {
    node = node[key];
  }
  node[path[path.length - 1]] = value;
  return clone;
}

/**
 * A flat, ordered description of every position in the tree and the type it
 * holds. Two files with the same shape signature differ only in the text they
 * carry — which is exactly the guarantee this phase needs.
 */
function shape(value: unknown, prefix: string, out: string[]): void {
  if (value === null) out.push(`${prefix}=null`);
  else if (Array.isArray(value)) {
    out.push(`${prefix}=array[${value.length}]`);
    value.forEach((v, i) => shape(v, `${prefix}.${i}`, out));
  } else if (typeof value === "object") {
    out.push(`${prefix}=object`);
    for (const key of Object.keys(value as object).sort()) {
      shape((value as Record<string, unknown>)[key], `${prefix}.${key}`, out);
    }
  } else out.push(`${prefix}=${typeof value}`);
}

function shapeOf(value: unknown): string[] {
  const out: string[] = [];
  shape(value, "", out);
  return out;
}

/** The two text treatments a photo-backed section may carry. */
export const TEXT_MODES = ["light", "dark"] as const;
export type TextModeValue = (typeof TEXT_MODES)[number];

/**
 * Is this value a photo slot — exactly
 * `{ src, alt, note, brightness, textMode }`?
 */
export function isPhotoObject(
  value: unknown,
): value is {
  src: string | null;
  alt: string;
  note: string;
  brightness: number | null;
  textMode: TextModeValue;
} {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const keys = Object.keys(value).sort().join(",");
  if (keys !== "alt,brightness,note,src,textMode") return false;
  const v = value as Record<string, unknown>;
  return (
    (typeof v.src === "string" || v.src === null) &&
    typeof v.alt === "string" &&
    typeof v.note === "string" &&
    (typeof v.brightness === "number" || v.brightness === null) &&
    TEXT_MODES.includes(v.textMode as TextModeValue)
  );
}

const BAD_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

export type PhotoEditOk = {
  ok: true;
  json: string;
  photo: {
    src: string | null;
    alt: string;
    note: string;
    brightness: number | null;
    textMode: TextModeValue;
  };
};

/**
 * Validate a whole photo-slot edit — src, alt and note together, as the one
 * unit they are. Same discipline as a text edit: the path must resolve to an
 * existing photo object, the texts are checked, the file's shape after the
 * edit must match its shape before everywhere except this slot's three
 * leaves, and the serialised bytes must re-parse to what was validated.
 *
 * `src` is not free text: it is either null (cleared, the pending frame), the
 * slot's current value (text-only edit), or a path the server itself just
 * generated for a processed upload — the caller decides which, never the form.
 * `brightness` is the same: measured from the stored bytes, never submitted.
 *
 * `textMode` does come from the form, and is checked against the two values
 * that exist. Anything else would leave the page with a mode nothing knows
 * how to render.
 */
export function validatePhotoEdit(
  data: Record<string, unknown>,
  rawPath: string,
  next: {
    src: string | null;
    alt: string;
    note: string;
    brightness: number | null;
    textMode: string;
  },
): PhotoEditOk | ValidationError {
  const path = parsePath(rawPath);
  if (!path) return { ok: false, error: "That photo slot could not be identified." };

  const current = getAtPath(data, path);
  if (!isPhotoObject(current)) {
    return {
      ok: false,
      error: "That is not a photo slot. Reload the page and try again.",
    };
  }

  for (const [label, text] of [
    ["alt text", next.alt],
    ["note", next.note],
  ] as const) {
    if (text.length > 1000) {
      return { ok: false, error: `The ${label} is too long — keep it under a thousand characters.` };
    }
    if (BAD_CHARS.test(text) || text.includes("\n")) {
      return { ok: false, error: `The ${label} contains characters that are not allowed.` };
    }
  }

  if (next.note.trim() === "") {
    return {
      ok: false,
      error:
        "The note cannot be empty — it is the label on the pending frame, and the brief to whoever fills the slot.",
    };
  }
  if (next.src !== null && next.alt.trim() === "") {
    return {
      ok: false,
      error:
        "A photograph needs its alt text — the description a visitor hears instead of seeing the image.",
    };
  }
  if (next.src === null && next.alt.trim() !== "") {
    return {
      ok: false,
      error: "An empty slot carries no alt text — there is no image for it to describe.",
    };
  }

  if (
    next.brightness !== null &&
    (!Number.isFinite(next.brightness) ||
      next.brightness < 0 ||
      next.brightness > 1)
  ) {
    return { ok: false, error: "That photograph could not be measured." };
  }
  if (next.src === null && next.brightness !== null) {
    return { ok: false, error: "An empty slot has no photograph to measure." };
  }

  if (!TEXT_MODES.includes(next.textMode as TextModeValue)) {
    return { ok: false, error: "That is not one of the two text colours." };
  }

  const cleaned = {
    src: next.src,
    alt: next.alt.trim(),
    note: next.note.trim(),
    brightness: next.brightness,
    textMode: next.textMode as TextModeValue,
  };

  let updated = data as unknown;
  for (const [leaf, value] of Object.entries(cleaned)) {
    updated = setAtPath(updated, [...path, leaf], value);
  }

  const before = shapeOf(data);
  const after = shapeOf(updated);
  if (before.length !== after.length) {
    return { ok: false, error: "That change would alter the structure of the file." };
  }
  // `brightness` is the one leaf that holds a number rather than text, so its
  // permitted types differ from the other four.
  const allowedTypes: Record<string, string[]> = {
    src: ["string", "null"],
    alt: ["string", "null"],
    note: ["string", "null"],
    brightness: ["number", "null"],
    textMode: ["string"],
  };
  const targets = Object.keys(allowedTypes).map((leaf) => ({
    prefix: `.${[...path, leaf].join(".")}=`,
    types: allowedTypes[leaf],
  }));
  for (let i = 0; i < before.length; i++) {
    if (before[i] === after[i]) continue;
    const target = targets.find(
      (t) => before[i].startsWith(t.prefix) && after[i].startsWith(t.prefix),
    );
    const allowed =
      target && new Set(target.types.map((t) => `${target.prefix}${t}`));
    if (!allowed || !allowed.has(before[i]) || !allowed.has(after[i])) {
      return { ok: false, error: "That change would alter the structure of the file." };
    }
  }

  const json = `${JSON.stringify(updated, null, 2)}\n`;
  try {
    if (JSON.stringify(JSON.parse(json)) !== JSON.stringify(updated)) {
      return { ok: false, error: "The saved file would not match what was validated." };
    }
  } catch {
    return { ok: false, error: "The saved file would not be valid JSON." };
  }

  return { ok: true, json, photo: cleaned };
}

export function validateEdit(
  file: string,
  data: Record<string, unknown>,
  rawPath: string,
  rawValue: string,
): ValidationOk | ValidationError {
  const path = parsePath(rawPath);
  if (!path) return { ok: false, error: "That field could not be identified." };

  const current = getAtPath(data, path);
  if (current === undefined) {
    return {
      ok: false,
      error: "That field no longer exists in this file. Reload and try again.",
    };
  }

  const rule = fieldRule(file, path, current);

  if (rule.kind === "image") {
    return {
      ok: false,
      error:
        "A photograph and its text are edited together, as one unit — use the photo editor for this slot.",
    };
  }
  // The panel does not offer an input for one of these, so reaching this is
  // either a stale page or a hand-made request. It is refused rather than
  // trusted, on the same reasoning as everything else in this file: the value
  // that would land here is real content, and it would render dashed and muted
  // as though the slot were still waiting for it.
  if (rule.kind === "section-type") {
    return {
      ok: false,
      error:
        "A section's layout cannot be retyped in place — its other fields belong to the layout it has, and the section would render empty. Adding and removing sections is coming as its own step.",
    };
  }
  if (rule.kind === "empty-state") {
    return {
      ok: false,
      error:
        "That is the placeholder shown while this slot is empty, not the slot itself — real words put there render inside the dashed pending frame, looking unfinished. Use the field named for the content instead.",
    };
  }
  if (!isEditableLeaf(current, rule)) {
    return {
      ok: false,
      error:
        "Only individual text fields can be edited. Adding or removing whole entries is not part of this phase.",
    };
  }

  if (typeof rawValue !== "string") {
    return { ok: false, error: "That value could not be read." };
  }
  if (rawValue.length > MAX_FIELD_LENGTH) {
    return {
      ok: false,
      error: `That value is too long — the limit is ${MAX_FIELD_LENGTH.toLocaleString()} characters.`,
    };
  }
  // Control characters would survive into the JSON and render as nothing, or
  // break the line structure of the file.
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(rawValue)) {
    return { ok: false, error: "That value contains characters that are not allowed." };
  }

  const trimmed = rawValue.trim();

  let next: string | null;
  if (trimmed === "") {
    if (!rule.nullable) {
      return {
        ok: false,
        error:
          "This field cannot be left empty. Clearing it would leave the page with nothing to render in its place.",
      };
    }
    next = null;
  } else {
    next = trimmed;
  }

  // The picker cannot produce a key outside the set, but the picker is not the
  // only thing that can reach a server action. A key with no mark behind it
  // renders the Circle's own mark instead of throwing, so this is not a broken
  // page — it is a section quietly showing the wrong thing, which is worse to
  // find later than a refused save is now.
  if (rule.kind === "icon") {
    if (!isIconKey(next)) {
      return {
        ok: false,
        error:
          "That is not one of the marks. Choose one from the grid — the site has no drawing for any other name.",
      };
    }
  }

  if (rule.kind === "slug" && next !== null) {
    // What a URL can carry without being rewritten by something downstream.
    // A capital or a space would still build — it would produce an address
    // that cannot be typed, said aloud or pasted back reliably, and one that
    // some clients would percent-encode and others would not. Refusing the
    // save is the cheaper failure.
    if (!/^[a-z0-9-]+$/.test(next)) {
      return {
        ok: false,
        error:
          "A web address can only use lowercase letters, numbers and hyphens — for example strategic-advisory. Nothing has been changed.",
      };
    }
  }

  if (rule.kind === "path" && next !== null) {
    // A single leading slash only. `//host` is protocol-relative and would
    // navigate off this site entirely, which is the one thing a link field
    // must never be able to do by accident. `..` is refused for the same
    // reason it is in a file path.
    const validPath =
      /^\/[A-Za-z0-9\-._~/]*$/.test(next) &&
      !next.startsWith("//") &&
      !next.includes("..");
    if (!validPath) {
      return {
        ok: false,
        error:
          "This must be a path on this site, starting with a single slash — for example /contact.",
      };
    }
  }

  const updated = setAtPath(data, path, next);

  // The backstop: everything except the edited position must be untouched,
  // and the edited position may only move between text and empty.
  const before = shapeOf(data);
  const after = shapeOf(updated);
  if (before.length !== after.length) {
    return { ok: false, error: "That change would alter the structure of the file." };
  }
  const target = `.${path.join(".")}=`;
  for (let i = 0; i < before.length; i++) {
    if (before[i] === after[i]) continue;
    const bothAtTarget =
      before[i].startsWith(target) && after[i].startsWith(target);
    const allowed = new Set([`${target}string`, `${target}null`]);
    if (!bothAtTarget || !allowed.has(before[i]) || !allowed.has(after[i])) {
      return { ok: false, error: "That change would alter the structure of the file." };
    }
  }

  // Serialise, then prove the bytes we are about to commit parse back to
  // exactly the object we validated. Nothing unparseable can get past here.
  const json = `${JSON.stringify(updated, null, 2)}\n`;
  let reparsed: unknown;
  try {
    reparsed = JSON.parse(json);
  } catch {
    return { ok: false, error: "The saved file would not be valid JSON." };
  }
  if (JSON.stringify(reparsed) !== JSON.stringify(updated)) {
    return { ok: false, error: "The saved file would not match what was validated." };
  }

  return { ok: true, json, value: next };
}
