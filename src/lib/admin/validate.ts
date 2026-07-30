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
      error: "Photographs are not editable yet — image upload arrives in the next phase.",
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
