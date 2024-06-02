import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";
import { Providers } from "./providers";
import { Navbar } from "./_components/navbar";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "CSFOL.IO",
  description: "Welcome to CSFOL.IO",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        {/* <ErrorBoundary> */}
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="theme"
        >
          <TRPCReactProvider>
            <Navbar />
            <div className="mx-6 ">{children}</div>
          </TRPCReactProvider>
          <Toaster />
        </Providers>
        {/* </ErrorBoundary> */}
      </body>
    </html>
  );
}
