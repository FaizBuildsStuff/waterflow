import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Waterflow — Work that flows like water",
  description:
    "Waterflow is the AI-powered workspace that thinks alongside your team — breaking down goals, automating follow-ups, and keeping every project in perfect motion.",
  keywords: ["productivity", "AI workspace", "task management", "team collaboration", "waterflow"],
  authors: [{ name: "FaizuRrehman - FaizBuildsStuff" }],
  openGraph: {
    title: "Waterflow — Work that flows like water",
    description:
      "The AI-powered workspace that keeps every project in perfect motion.",
    siteName: "Waterflow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Waterflow — Work that flows like water",
    description:
      "The AI-powered workspace that keeps every project in perfect motion.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@401,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300"
        style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 401 }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}