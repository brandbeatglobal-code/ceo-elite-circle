/**
 * Every photographic slot on the site, in one place.
 *
 * `src` is an images.unsplash.com URL (hotlinked — the host is allow-listed in
 * next.config.ts, nothing is downloaded). A slot with `src: null` renders a
 * labelled "photography pending" frame instead of an image, so a missing photo
 * reads as deliberate rather than broken.
 *
 * To fill a pending slot: paste the Unsplash URL into `src`. Nothing else
 * needs to change.
 */
export type Photo = {
  src: string | null;
  alt: string;
  /** What this slot wants, for whoever fills it in. */
  note: string;
};

export const photos = {
  hero: {
    src: "https://images.unsplash.com/photo-1663900108404-a05e8bf82cda",
    alt: "City skyline at dusk with illuminated towers",
    note: "Dramatic, low-light architecture or skyline. Carries the hero.",
  },
  whyNow: {
    src: "https://images.unsplash.com/photo-1736528520038-015c130d0f9b",
    alt: "Aerial view of a modern highway leading into a city",
    note: "Warm, full-colour, wide. Forward motion.",
  },
  privateDinners: {
    src: "https://images.unsplash.com/photo-1769771744699-7b73a101b318",
    alt: "Elegant private dining room set for an intimate dinner",
    note: "Intimate, warm interior. Anchors Signature Experiences.",
  },

  /* Membership tiers — desaturated documentary, per the reference's
     black-and-white packages row. Rendered greyscale in CSS, so a colour
     photograph is fine here. */
  tierExecutive: {
    src: null,
    alt: "",
    note: "Documentary: a working session or boardroom, mid-conversation.",
  },
  tierElite: {
    src: null,
    alt: "",
    note: "Documentary: a small group in discussion, candid rather than posed.",
  },
  tierChairman: {
    src: null,
    alt: "",
    note: "Documentary: a formal room or a single figure, quiet and composed.",
  },
} satisfies Record<string, Photo>;
