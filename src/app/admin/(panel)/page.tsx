import { requireAdmin } from "@/lib/admin/auth";
import { listContentFiles } from "@/lib/admin/registry";
import { ArrowLink } from "@/components/ui";

export const dynamic = "force-dynamic";

/**
 * Every editable content file, derived from the `content/` directory itself —
 * see `src/lib/admin/registry.ts`. Nothing here is hand-listed, so a new
 * content file appears without touching the admin.
 */
export default async function AdminIndexPage() {
  await requireAdmin();
  const files = listContentFiles();

  return (
    <div className="wrap py-10 lg:py-14">
      <div className="max-w-5xl">
        <h1 className="type-display type-h3">Content</h1>
        <p className="type-body text-olive mt-3 max-w-md">
          Everything editable on the site, one file per page plus the two
          shared files. Read-only for now — editing arrives in the next phase.
        </p>

        <div className="border-t border-hair mt-10">
          {files.map((file) => (
            <div
              key={file.name}
              className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-2 border-b border-hair py-6"
            >
              <div>
                <h2 className="type-body font-medium text-ink">{file.label}</h2>
                <p className="type-label text-olive mt-1">{file.fileName}</p>
              </div>
              <p className="type-label text-olive md:border-l border-hair md:pl-6 md:py-1">
                {file.feeds}
              </p>
              <p className="type-label text-olive md:border-l border-hair md:pl-6 md:py-1">
                {file.sectionCount} sections · {file.fieldCount} fields
              </p>
              <div className="md:border-l border-hair md:pl-6 md:py-1 md:justify-self-end">
                <ArrowLink href={`/admin/content/${file.name}`}>
                  Review
                </ArrowLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
