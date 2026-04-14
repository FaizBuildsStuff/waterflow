import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Anthryve — Elevate your agency's momentum",
  description:
    "Anthryve is the AI-powered workspace that thinks alongside your team — breaking down goals, automating follow-ups, and keeping every project in perfect motion.",
  keywords: ["productivity", "AI workspace", "task management", "team collaboration", "anthryve"],
  authors: [{ name: "FaizuRrehman - FaizBuildsStuff" }],
  openGraph: {
    title: "Anthryve — Elevate your agency's momentum",
    description:
      "The AI-powered workspace that keeps every project in perfect motion.",
    siteName: "Anthryve",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anthryve — Elevate your agency's momentum",
    description:
      "The AI-powered workspace that keeps every project in perfect motion.",
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
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}