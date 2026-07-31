"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { PhotoPreview } from "@/lib/admin/schema";
import {
  estimateContrast,
  storedMode,
  type Photo,
  type TextMode,
} from "@/lib/images";
import {
  savePhoto,
  type SaveState,
} from "@/app/admin/(panel)/content/[file]/actions";

const initial: SaveState = { status: "idle" };
/** Longest edge for the client-side resize, before anything is sent. */
const CLIENT_MAX_DIM = 2000;
const CLIENT_MAX_BYTES = 12 * 1024 * 1024;

/** What WCAG asks of body text. Quoted, never enforced here. */
const AA_BODY = 4.5;

/**
 * Roughly what contrast the copy would get, for the mode currently selected.
 *
 * Guidance rather than a gate — the whole point of the toggle is that the
 * editor judges this by eye, with a number to hand. Two things it is careful
 * to say rather than imply: the estimate is against the *brightest* area of
 * the photograph, which is the worst case for white copy and the best case
 * for dark copy; and a photograph that has never been measured is being
 * treated as a white one.
 */
function contrastReading(
  photo: Photo,
  mode: TextMode,
  clearing: boolean,
  reselected: boolean,
): { text: string; comfortable: boolean } {
  if (clearing || photo.src === null) {
    return {
      text: "No photograph in this slot yet, so there is nothing to read a contrast against. The pending frame carries its own label instead.",
      comfortable: true,
    };
  }

  const ratio = estimateContrast({ ...photo, textMode: mode });
  const comfortable = ratio >= AA_BODY;
  const headline = `Approximately ${ratio.toFixed(1)}:1 — WCAG recommends ${AA_BODY}:1 for body text.`;

  const against =
    mode === "dark"
      ? " Read against the brightest area of the photograph, which is the easiest part of it for dark copy; darker areas of the same picture will read worse."
      : " Read against the brightest area of the photograph, which is the worst case for white copy.";

  const unmeasured =
    photo.brightness === null
      ? " This photograph has never been measured, so the reading assumes a white one — upload it again through here to measure it."
      : "";

  const stale = reselected
    ? " This is the photograph currently in the slot; the one you have chosen is measured when you save, and the reading follows it then."
    : "";

  return { text: headline + against + unmeasured + stale, comfortable };
}

type Pending =
  | { kind: "processed"; blob: Blob; url: string; name: string }
  /** Could not be decoded in this browser (HEIC on desktop) — sent as-is for
   *  the server to convert. No local preview is possible. */
  | { kind: "raw"; blob: File; name: string };

/**
 * One photo slot: the image, its alt text, its note and — where the section
 * puts words on top of the picture — its text colour, edited and saved
 * together. The preview renders inside the slot's real proportions with
 * `object-cover` — the same treatment the site uses — so what the editor sees
 * cropped is what actually ships cropped.
 */
export function PhotoEditor({
  file,
  path,
  photo,
  previews,
  textOver,
}: {
  file: string;
  path: string;
  photo: Photo;
  previews: PhotoPreview[];
  /** What one text mode governs on this slot, or null where it governs
   *  nothing — a portrait has no copy over it, and a control that changes
   *  nothing is worse than no control. */
  textOver: string | null;
}) {
  const [state, dispatch, pending] = useActionState(savePhoto, initial);
  const [alt, setAlt] = useState(photo.alt);
  const [note, setNote] = useState(photo.note);
  const [textMode, setTextMode] = useState<TextMode>(storedMode(photo));
  const [selected, setSelected] = useState<Pending | null>(null);
  const [clearing, setClearing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewBroken, setPreviewBroken] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const id = useId();

  // A failed load can happen before hydration attaches onError — a freshly
  // committed upload is not servable until its deploy lands. Check the
  // image's actual state once mounted, so the miss still gets the honest
  // frame rather than a broken icon.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setPreviewBroken(true);
  }, []);

  const dirty =
    selected !== null ||
    clearing ||
    alt !== photo.alt ||
    note !== photo.note ||
    textMode !== storedMode(photo);

  const showingSrc = clearing
    ? null
    : selected?.kind === "processed"
      ? selected.url
      : selected?.kind === "raw"
        ? null
        : photo.src;

  const reading = contrastReading(photo, textMode, clearing, selected !== null);

  async function takeFile(f: File) {
    setLocalError(null);
    setClearing(false);
    if (f.size > CLIENT_MAX_BYTES) {
      setLocalError("That file is too large — the limit is 12 MB.");
      return;
    }
    try {
      const bitmap = await createImageBitmap(f);
      const scale = Math.min(
        1,
        CLIENT_MAX_DIM / Math.max(bitmap.width, bitmap.height),
      );
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      // Flatten any transparency onto white rather than JPEG's black.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(bitmap, 0, 0, w, h);
      bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.85),
      );
      if (!blob) throw new Error("encode failed");
      setSelected({
        kind: "processed",
        blob,
        url: URL.createObjectURL(blob),
        name: f.name,
      });
    } catch {
      // This browser cannot decode it — an iPhone photo (HEIC) on a desktop.
      // The server converts it; there is just no preview until it is saved.
      setSelected({ kind: "raw", blob: f, name: f.name });
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("file", file);
    fd.set("path", path);
    fd.set("alt", clearing ? "" : alt);
    fd.set("note", note);
    fd.set("textMode", textMode);
    if (clearing) fd.set("clear", "1");
    else if (selected) fd.set("image", selected.blob, "upload");
    startTransition(() => dispatch(fd));
  }

  return (
    <form
      onSubmit={submit}
      data-photo-path={path}
      className="flex flex-col gap-4 max-w-xl"
    >
      {/* ---- The slot, at its real shape(s) ---- */}
      <div className="flex flex-col gap-4">
        {previews.map((p) => (
          <div key={p.label}>
            <p className="type-label text-olive mb-1.5">{p.label}</p>
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: String(p.ratio) }}
            >
              {showingSrc && !previewBroken ? (
                // Plain <img>, deliberately: the admin needs the true crop,
                // not the optimiser, and object URLs never pass through it.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={showingSrc}
                  ref={imgRef}
                  src={showingSrc}
                  alt=""
                  onError={() => setPreviewBroken(true)}
                  onLoad={() => setPreviewBroken(false)}
                  className="absolute inset-0 w-full h-full object-cover border border-hair"
                />
              ) : showingSrc && previewBroken ? (
                // A freshly committed upload is not servable until the deploy
                // lands — say so rather than showing a broken image icon.
                <div className="absolute inset-0 border border-dashed border-hair bg-mint/40 flex items-end p-4">
                  <p className="type-label italic text-olive">
                    The photograph is saved — its preview appears once the
                    deploy finishes, in about a minute.
                  </p>
                </div>
              ) : (
                <div className="absolute inset-0 border border-dashed border-hair bg-mint/40 flex items-end p-4">
                  <p className="type-label italic text-olive">
                    {selected?.kind === "raw"
                      ? "iPhone photo (HEIC) — converted when you save; the preview appears after the deploy."
                      : `Photography pending — ${note || "this slot is empty."}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ---- Choose a file ---- */}
      <div
        className={`border border-dashed px-4 py-4 flex flex-wrap items-center gap-x-4 gap-y-2 transition-colors ${
          dragOver ? "border-sage bg-mint/50" : "border-hair"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) void takeFile(f);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          className="sr-only"
          id={`${id}-file`}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void takeFile(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="pill type-link border border-hair text-ink px-5 py-2 hover:border-sage hover:text-sage transition-colors"
        >
          Choose a photograph
        </button>
        <span className="type-label text-olive">
          {selected
            ? `Selected: ${selected.name}`
            : "or drag one here. JPEG, PNG, WebP or an iPhone photo (HEIC)."}
        </span>
      </div>

      {photo.src && !clearing && !selected && (
        <p className="type-label text-olive break-all">
          Current image: {photo.src}
        </p>
      )}

      {/* ---- Alt and note, part of the same save ---- */}
      <label className="flex flex-col gap-1.5">
        <span className="type-label text-olive">Alt text</span>
        <input
          type="text"
          value={clearing ? "" : alt}
          onChange={(e) => setAlt(e.target.value)}
          disabled={clearing}
          className="admin-field disabled:opacity-40"
        />
        <span className="type-label text-olive/70">
          {clearing
            ? "An empty slot carries no alt text."
            : "What a visitor hears instead of seeing the photograph."}
        </span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="type-label text-olive">Note</span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="admin-field"
        />
        <span className="type-label text-olive/70">
          The brief for this slot — shown on the pending frame while it is
          empty.
        </span>
      </label>

      {/* ---- Text colour, where this photograph has words on top of it ----
          Two choices rather than a colour picker: the site never carries more
          than two text treatments on one background, and one of them is the
          near-black ink already used on cream. The contrast reading beneath
          is information — it never refuses a save. */}
      {textOver && (
        <fieldset className="flex flex-col gap-2.5 border-t border-hair pt-5">
          <legend className="type-label text-olive">
            Text colour over this photograph
          </legend>

          <div className="flex gap-2" role="group">
            {(["light", "dark"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setTextMode(m)}
                aria-pressed={textMode === m}
                className={`pill type-link px-5 py-2 border transition-colors ${
                  textMode === m
                    ? "bg-ink text-white border-ink"
                    : "border-hair text-olive hover:border-sage hover:text-sage"
                }`}
              >
                {m === "light" ? "Light — white" : "Dark — near-black"}
              </button>
            ))}
          </div>

          <p className="type-label text-olive/70 max-w-xl">{textOver}</p>

          <p
            className={`type-label italic border-l-2 pl-3 max-w-xl ${
              reading.comfortable
                ? "border-sage text-olive"
                : "border-ink text-ink"
            }`}
          >
            {reading.text}
          </p>
        </fieldset>
      )}

      {/* ---- Actions ---- */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="submit"
          disabled={pending || !dirty}
          className="pill type-link bg-ink text-white px-5 py-2 inline-flex items-center gap-2 hover:bg-sage transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ink"
        >
          <span aria-hidden="true">•</span>
          {pending ? "Saving…" : "Save"}
        </button>

        {photo.src !== null && (
          <button
            type="button"
            onClick={() => {
              setClearing(!clearing);
              setSelected(null);
              setLocalError(null);
            }}
            className="type-link text-olive hover:text-sage transition-colors"
          >
            {clearing ? "Keep the photograph" : "Clear this slot"}
          </button>
        )}
        {selected && (
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setLocalError(null);
            }}
            className="type-link text-olive hover:text-sage transition-colors"
          >
            Discard selection
          </button>
        )}
      </div>

      {clearing && (
        <p className="type-label text-olive italic border-l-2 border-sage pl-3 max-w-xl">
          Saving will empty this slot: the page shows its labelled
          &ldquo;photography pending&rdquo; frame again, exactly as it does for
          a slot that was never filled.
        </p>
      )}

      {localError && (
        <p className="type-label text-ink italic" role="alert">
          {localError}
        </p>
      )}
      {state.status === "saved" && (
        <p className="type-label text-sage" role="status">
          {state.message}
        </p>
      )}
      {state.status === "error" && (
        <p className="type-label text-ink italic" role="alert">
          Not saved — {state.message}
        </p>
      )}
    </form>
  );
}
