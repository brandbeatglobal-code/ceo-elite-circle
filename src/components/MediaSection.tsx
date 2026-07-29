import Image from "next/image";
import { ReactNode } from "react";

export function MediaSection({
  eyebrow,
  title,
  image,
  imageSide = "right",
  tone = "light",
  children,
}: {
  eyebrow?: string;
  title: string;
  image: { src: string; alt: string };
  imageSide?: "left" | "right";
  tone?: "light" | "stone";
  children?: ReactNode;
}) {
  return (
    <section className={tone === "stone" ? "bg-stone" : "bg-white"}>
      <div className="wrap py-20 md:py-28">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
            imageSide === "left" ? "" : "lg:[&>*:first-child]:order-2"
          }`}
        >
          <div className="relative aspect-[4/5] md:aspect-[4/3] w-full overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.2em] text-gold mb-4">
                {eyebrow}
              </p>
            )}
            <h2 className="text-3xl md:text-5xl text-forest mb-6">{title}</h2>
            <div className="divider-gold mb-8" />
            <div className="text-ink-soft leading-relaxed max-w-md">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
