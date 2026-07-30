import { keyLabel } from "@/lib/admin/registry";

/**
 * Read-only rendering of any value a content file can hold. Recursive and
 * schema-free: it walks whatever shape the JSON has, which is what lets the
 * admin show a file it has never seen. Phase 3 replaces the leaves with
 * inputs; the walk stays the same.
 */
export function ValueView({ value }: { value: unknown }) {
  if (value === null) {
    return (
      <p className="type-label italic text-olive border border-dashed border-hair px-3 py-2.5 max-w-xl">
        Not set — the page renders its labelled placeholder.
      </p>
    );
  }

  if (typeof value === "string") {
    if (value === "") {
      return (
        <p className="type-label italic text-olive border border-dashed border-hair px-3 py-2.5 max-w-xl">
          Empty
        </p>
      );
    }
    return (
      <p className="type-body text-ink whitespace-pre-wrap border border-hair bg-white/70 px-3 py-2.5 max-w-xl">
        {value}
      </p>
    );
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return (
      <p className="type-body text-ink border border-hair bg-white/70 px-3 py-2.5 max-w-xl">
        {String(value)}
      </p>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <p className="type-label italic text-olive border border-dashed border-hair px-3 py-2.5 max-w-xl">
          None yet — deliberately empty.
        </p>
      );
    }
    return (
      <ol className="flex flex-col gap-5">
        {value.map((item, i) => (
          <li key={i} className="border-l border-hair pl-5">
            <p className="type-label text-olive mb-2">{i + 1}</p>
            <ValueView value={item} />
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {Object.entries(value as Record<string, unknown>).map(([key, child]) => (
        <div key={key}>
          <p className="type-label text-olive mb-2">{keyLabel(key)}</p>
          <ValueView value={child} />
        </div>
      ))}
    </div>
  );
}
