import type { Metadata } from "next";
import { LanguageProvider } from "@/src/hooks/useLanguage";
import "./globals.css";

export const metadata: Metadata = {
  title: "AAT - ASMA for Advanced Technologies | أسماء للتكنولوجيا المتقدمة",
  description: "We transform ideas into rapid, cloud-scale, secure, and beautiful digital realities. Customized digital agency based in Riyadh (CR 7003024853). Headless SEO, custom mobile iOS & Android, Desktop ERP software, and AI Integration.",
  metadataBase: new URL(process.env.APP_URL || "https://asmatechsa.com"),
  openGraph: {
    title: "AAT - ASMA for Advanced Technologies | أسماء للتكنولوجيا المتقدمة",
    description: "We transform ideas into rapid, cloud-scale, secure, and beautiful digital realities. Riyadh-based digital agency.",
    images: [
      {
        url: "/assets/asma_logo.png",
        width: 1200,
        height: 630,
        alt: "ASMA Advanced Technology",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html lang="ar" dir="rtl">
        <body>
          {children}
        </body>
      </html>
    </LanguageProvider>
  );
}
