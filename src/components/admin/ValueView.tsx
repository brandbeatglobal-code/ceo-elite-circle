import { keyLabel } from "@/lib/admin/registry";
import {
  fieldRule,
  isEditableLeaf,
  isEmptyStateField,
  photoPreviews,
  textOverPhoto,
} from "@/lib/admin/schema";
import { isPhotoObject } from "@/lib/admin/validate";
import { FieldEditor } from "@/components/admin/FieldEditor";
import { PhotoEditor } from "@/components/admin/PhotoEditor";

/**
 * Walks a content file and renders each leaf.
 *
 * Schema-free and recursive, the same walk the read-only shell used — it just
 * puts an input at each editable leaf now. A content file it has never seen
 * still renders correctly, which is what keeps the admin derived from
 * `content/` rather than hand-maintained.
 *
 * A whole photo slot renders as one editor — image, alt text and note
 * together. A photo leaf reached on its own is display-only, because alt text
 * must describe the image that is actually there.
 *
 * **Placeholder text is lifted out of the field list and shown after it**, in
 * its own block, read-only. Interleaved among the content fields it reads as
 * more places to put content, which is exactly what happened: a member's
 * testimonial went into three of them before the fields that take it were
 * found. Separating them is the half of the fix a label could not do — the
 * first occurrence was answered with a label, and the second one happened
 * anyway.
 */
export function ValueView({
  file,
  path = [],
  label,
  value,
}: {
  file: string;
  path?: string[];
  label?: string;
  value: unknown;
}) {
  const rule = fieldRule(file, path, value);

  // A whole photo slot — image, alt and note edited together, as one unit.
  if (isPhotoObject(value)) {
    return (
      <PhotoEditor
        file={file}
        path={path.join(".")}
        photo={value}
        previews={photoPreviews(file, path)}
        textOver={textOverPhoto(file, path)}
      />
    );
  }

  // Placeholder text, shown the way it actually appears on the page — dashed
  // and muted — so what it is is legible before the note explains it.
  if (rule.kind === "empty-state") {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="type-label text-olive">
            {label ?? keyLabel(path[path.length - 1] ?? "")}
          </p>
          <span className="type-label text-sage shrink-0">• Read-only</span>
        </div>
        <p className="type-body italic text-olive border border-dashed border-hair px-4 py-3 max-w-xl">
          {value === null || value === "" ? "—" : String(value)}
        </p>
        {rule.structural && (
          <p className="type-label text-olive italic border-l-2 border-sage pl-3 max-w-xl">
            {rule.structural}
          </p>
        )}
      </div>
    );
  }

  if (rule.kind === "image" || rule.kind === "icon") {
    // A stray photo leaf outside a full slot, or the key naming a mark —
    // display only. Photographs are edited as a unit above; a mark is design.
    return (
      <div className="flex flex-col gap-1.5">
        {label && <p className="type-label text-olive">{label}</p>}
        <p className="type-body text-olive border border-dashed border-hair bg-mint/30 px-3 py-2.5 max-w-xl">
          <span className="break-all">
            {value === null || value === "" ? "—" : String(value)}
          </span>
        </p>
        {rule.kind === "icon" && rule.structural && (
          <p className="type-label text-olive italic border-l-2 border-sage pl-3 max-w-xl">
            {rule.structural}
          </p>
        )}
      </div>
    );
  }

  // A list or record that is currently absent — `variants`, a leadership
  // `quote`. Never a text input: the note explains what its absence does.
  if (rule.kind === "group" && value === null) {
    return (
      <div className="flex flex-col gap-2">
        {label && <p className="type-label text-olive">{label}</p>}
        {rule.structural && (
          <p className="type-label text-olive italic border-l-2 border-sage pl-3 max-w-xl">
            {rule.structural}
          </p>
        )}
        <p className="type-label italic text-olive border border-dashed border-hair px-3 py-2.5 max-w-xl">
          Not set — deliberately absent. Adding one is not part of this phase.
        </p>
      </div>
    );
  }

  if (isEditableLeaf(value, rule)) {
    return (
      <FieldEditor
        file={file}
        path={path.join(".")}
        label={label ?? keyLabel(path[path.length - 1] ?? "")}
        value={value as string | null}
        rule={rule}
      />
    );
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return (
      <div className="flex flex-col gap-1.5">
        {label && <p className="type-label text-olive">{label}</p>}
        <p className="type-body text-ink border border-hair bg-white/70 px-3 py-2.5 max-w-xl">
          {String(value)}
        </p>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="flex flex-col gap-4">
        {label && <p className="type-label text-olive">{label}</p>}
        {rule.structural && (
          <p className="type-label text-olive italic border-l-2 border-sage pl-3 max-w-xl">
            {rule.structural}
          </p>
        )}
        {value.length === 0 ? (
          <p className="type-label italic text-olive border border-dashed border-hair px-3 py-2.5 max-w-xl">
            None yet — deliberately empty.
          </p>
        ) : (
          <ol className="flex flex-col gap-8">
            {value.map((item, i) => (
              <li key={i} className="border-l border-hair pl-5">
                <p className="type-label text-olive mb-3">{i + 1}</p>
                <ValueView
                  file={file}
                  path={[...path, String(i)]}
                  value={item}
                />
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  }

  // The content fields first, in file order, then the placeholders in their
  // own block. Both halves keep their real paths, so nothing about saving or
  // validating changes — this is only where each one is on the page.
  const entries = Object.entries((value ?? {}) as Record<string, unknown>);
  const content = entries.filter(
    ([key]) => !isEmptyStateField(file, [...path, key]),
  );
  const placeholders = entries.filter(([key]) =>
    isEmptyStateField(file, [...path, key]),
  );

  return (
    <div className="flex flex-col gap-6">
      {label && <p className="type-label text-olive">{label}</p>}
      {rule.structural && (
        <p className="type-label text-olive italic border-l-2 border-sage pl-3 max-w-xl">
          {rule.structural}
        </p>
      )}
      {content.map(([key, child]) => (
        <ValueView
          key={key}
          file={file}
          path={[...path, key]}
          label={keyLabel(key)}
          value={child}
        />
      ))}

      {placeholders.length > 0 && (
        <div className="border-t border-hair pt-6 flex flex-col gap-6">
          <div>
            <p className="type-label text-sage">• Placeholder text</p>
            <p className="type-label text-olive italic mt-2 max-w-xl">
              Not content. Each of these is what the page shows in place of
              something it has not been given yet, and each disappears on its
              own once the real thing is filled in above. They are read-only
              here — words put in one of them would render inside the dashed
              pending frame, looking unfinished.
            </p>
          </div>
          {placeholders.map(([key, child]) => (
            <ValueView
              key={key}
              file={file}
              path={[...path, key]}
              label={keyLabel(key)}
              value={child}
            />
          ))}
        </div>
      )}
    </div>
  );
}
