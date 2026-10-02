import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GI hormones — Interactive teaching model",
  description: "Explore gastrointestinal anatomy and the hormones that connect the gut to the body.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
