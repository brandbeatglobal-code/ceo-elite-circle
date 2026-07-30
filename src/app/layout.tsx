import type { Metadata } from "next";
import "@fontsource/sora/300.css";
import "@fontsource/sora/400.css";
import "@fontsource/sora/500.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";
import "@fontsource/fraunces/300.css";
import "@fontsource/fraunces/400.css";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { DraftBanner } from "@/components/DraftBanner";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: site.metadata.title,
  description: site.metadata.description,
};

/**
 * Runs synchronously before first paint, so nothing flashes. Adds the motion
 * flag only when JavaScript runs and reduced motion is not requested — the CSS
 * that hides revealable content is scoped to this class, so content stays
 * visible in every other case.
 */
const motionFlag = `try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-anim')}}catch(e){}
try{if(localStorage.getItem('cec-draft-banner-dismissed')==='1'){document.documentElement.classList.add('draft-dismissed')}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <DraftBanner />
        <Reveal />
      </body>
    </html>
  );
}
