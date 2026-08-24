import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nirvash CV Maker — Your CV. Made Effortlessly. ✨ v3",
  description:
    "Create a professional CV in minutes. Answer simple questions or fill out a form, pick a beautiful template, and download a polished resume. No experience required.",
  keywords: [
    "CV builder",
    "resume maker",
    "professional CV",
    "Nirvash",
    "ATS friendly resume",
    "online CV creator",
  ],
  authors: [{ name: "Nirvash" }],
  icons: {
    icon: [
      { url: "/nirvash-logo-nav.png", type: "image/png", sizes: "256x256" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/nirvash-logo-nav.png",
  },
  openGraph: {
    title: "Nirvash CV Maker",
    description: "Your CV. Made Effortlessly.",
    siteName: "Nirvash CV Maker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nirvash CV Maker",
    description: "Your CV. Made Effortlessly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-cache meta tags */}
        <meta httpEquiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var theme = stored || 'dark';
                  document.documentElement.className = theme;
                } catch (e) {
                  document.documentElement.className = 'dark';
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
