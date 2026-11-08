import type { Metadata } from "next";
import { SiteProvider, SiteShell } from "@/components/site-shell";
import "./globals.css";
import "./details.css";
import "./visual-upgrade.css";
import "./legibility.css";
import "./language-switch.css";

export const metadata: Metadata = {
  title: { default: "Shiteng Lu · Research & Fieldnotes", template: "%s · Shiteng Lu" },
  description: "Shiteng Lu — undergraduate at UESTC and research intern at Tsinghua University. Research in AI safety, efficient neural networks, and an emerging interest in neuroscience.",
  icons: { icon: "/favicon.svg" },
  openGraph: { title: "Shiteng Lu · Research & Fieldnotes", description: "Research, experiments, and ideas in progress.", type: "website" },
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en" suppressHydrationWarning><body><SiteProvider><SiteShell>{children}</SiteShell></SiteProvider></body></html>;
}
