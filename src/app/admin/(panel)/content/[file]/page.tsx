import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { displayContent } from "@/lib/admin/content";
import { keyLabel } from "@/lib/admin/registry";
import { pendingFor } from "@/lib/admin/structure";
import { SectionOrder } from "@/components/admin/SectionOrder";
import { ValueView } from "@/components/admin/ValueView";

export const dynamic = "force-dynamic";

/**
 * One content file: its sections are the file's top-level keys, its fields the
 * values, rendered by a schema-free walk that puts an input at every editable
 * leaf.
 *
 * The values come from the repository, read on each request — not from this
 * server's copy of `content/`, which on Vercel is a build-time snapshot and
 * therefore a minute behind after any save. Showing a value that a save has
 * already replaced would invite the editor to save it back again.
 */
export default async function ContentFilePage({
  params,
}: {
  params: Promise<{ file: string }>;
}) {
  await requireAdmin();
  const { file } = await params;
  const live = await displayContent(file);
  if (!live) notFound();
  const { cf, note } = live;

  // Only a page whose body is a section array gets the order controls. Every
  // other file walks its fields exactly as before.
  const sections = (cf.data as { sections?: unknown }).sections;
  const order = Array.isArray(sections)
    ? sections.map((s) => {
        const o = (s ?? {}) as Record<string, unknown>;
        return {
          id: String(o.id ?? ""),
          title: String(o.title ?? "Untitled section"),
          type: String(o.type ?? ""),
        };
      })
    : null;
  const pending = order ? await pendingFor(cf.name) : null;

  return (
    <div className="wrap py-10 lg:py-14">
      <div className="max-w-5xl">
        <Link
          href="/admin"
          className="type-link text-olive hover:text-sage transition-colors"
        >
          ← All content
        </Link>

        <div className="mt-6 border-b border-hair pb-8">
          <h1 className="type-display type-h3">{cf.label}</h1>
          <p className="type-label text-olive mt-3">
            {cf.fileName} · {cf.feeds} · {cf.sectionCount} sections ·{" "}
            {cf.fieldCount} fields
          </p>
          <p className="type-label italic text-olive mt-2 max-w-xl">
            Editing one field at a time. Saving commits the change to the
            repository, which publishes it — allow about a minute. A
            photograph, its alt text and its note are saved together.
          </p>
          {note && (
            <p className="type-label italic text-olive mt-3 max-w-xl border-l-2 border-sage pl-3">
              {note}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          {order && (
            <SectionOrder
              file={cf.name}
              rows={order}
              pending={
                pending?.ok && pending.pending
                  ? {
                      summary: pending.pending.summary,
                      previewUrl: pending.pending.previewUrl,
                      compareUrl: pending.pending.compareUrl,
                      sha: pending.pending.sha,
                    }
                  : null
              }
            />
          )}

          {Object.entries(cf.data).map(([key, value]) => (
            <section
              key={key}
              className="border-b border-hair py-8 grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
              <h2 className="type-body font-medium text-ink">
                {keyLabel(key)}
              </h2>
              <div className="lg:col-span-3 lg:border-l border-hair lg:pl-8">
                <ValueView file={cf.name} path={[key]} value={value} />
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
