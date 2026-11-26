import type { Metadata } from "next";
import { SiteProvider, SiteShell } from "@/components/site-shell";
import "./globals.css";
import "./details.css";
import "./visual-upgrade.css";
import "./legibility.css";
import "./language-switch.css";
import "./refinements.css";

export const metadata: Metadata = {
  title: { default: "Shiteng Lu · Research & Fieldnotes", template: "%s · Shiteng Lu" },
  description:
    "Shiteng Lu — undergraduate at UESTC and research intern at Tsinghua University. Research in CAD geometry evaluation (DrawScore), LLM safety (CodeSpear), efficient spiking neural networks (FALCON), and 3D neuron segmentation (NISB).",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Shiteng Lu · Research & Fieldnotes",
    description:
      "Research in CAD evaluation, LLM safety, spiking neural networks, and 3D EM neuron segmentation.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SiteProvider>
          <SiteShell>{children}</SiteShell>
        </SiteProvider>
      </body>
    </html>
  );
}
