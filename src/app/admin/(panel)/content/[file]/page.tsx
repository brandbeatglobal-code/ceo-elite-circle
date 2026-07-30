import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { contentFile, keyLabel } from "@/lib/admin/registry";
import { ValueView } from "@/components/admin/ValueView";

export const dynamic = "force-dynamic";

/**
 * One content file, read-only: its sections are the file's top-level keys,
 * its fields the values, rendered by the same schema-free walk that Phase 3's
 * forms will bind inputs to. Showing the live values (not just labels) is
 * deliberate — it proves the generated navigation resolves to real data.
 */
export default async function ContentFilePage({
  params,
}: {
  params: Promise<{ file: string }>;
}) {
  await requireAdmin();
  const { file } = await params;
  const cf = contentFile(file);
  if (!cf) notFound();

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
        </div>

        <div className="flex flex-col">
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
