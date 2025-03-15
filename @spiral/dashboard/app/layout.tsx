import "@/styles/globals.css";

import {fontGeist, fontHeading, fontSans, fontUrban} from "@/assets/fonts";
import {ThemeProvider} from "next-themes";

import {cn, constructMetadata} from "@/lib/utils";
import {Toaster} from "@/components/ui/sonner";
import {Analytics} from "@/components/analytics";
import {TailwindIndicator} from "@/components/tailwind-indicator";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = constructMetadata();

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontUrban.variable,
          fontHeading.variable,
          fontGeist.variable,
        )}
      >
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
        {children}
        <Analytics />
        <Toaster richColors closeButton />
        <TailwindIndicator />
      </ThemeProvider>
      </body>
    </html>
  );
}
