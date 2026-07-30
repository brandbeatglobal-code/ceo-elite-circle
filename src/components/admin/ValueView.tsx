import { keyLabel } from "@/lib/admin/registry";
import { fieldRule, isEditableLeaf } from "@/lib/admin/schema";
import { FieldEditor } from "@/components/admin/FieldEditor";

/**
 * Walks a content file and renders each leaf.
 *
 * Schema-free and recursive, the same walk the read-only shell used — it just
 * puts an input at each editable leaf now. A content file it has never seen
 * still renders correctly, which is what keeps the admin derived from
 * `content/` rather than hand-maintained.
 *
 * Photographs are shown but not editable: image upload is Phase 4, and a slot
 * left out entirely would look broken rather than pending.
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

  if (rule.kind === "image") {
    return (
      <div className="flex flex-col gap-1.5">
        {label && <p className="type-label text-olive">{label}</p>}
        <p className="type-body text-olive border border-dashed border-hair bg-mint/30 px-3 py-2.5 max-w-xl">
          {value === null || value === "" ? (
            <span className="italic">Not set — the page shows a labelled &ldquo;photography pending&rdquo; frame.</span>
          ) : (
            <span className="break-all">{String(value)}</span>
          )}
        </p>
        <p className="type-label text-olive/70 italic">
          Photographs are not editable yet — upload arrives in the next phase.
        </p>
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

  return (
    <div className="flex flex-col gap-6">
      {label && <p className="type-label text-olive">{label}</p>}
      {rule.structural && (
        <p className="type-label text-olive italic border-l-2 border-sage pl-3 max-w-xl">
          {rule.structural}
        </p>
      )}
      {Object.entries((value ?? {}) as Record<string, unknown>).map(
        ([key, child]) => (
          <ValueView
            key={key}
            file={file}
            path={[...path, key]}
            label={keyLabel(key)}
            value={child}
          />
        ),
      )}
    </div>
  );
}
