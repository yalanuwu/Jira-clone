import type { Metadata } from "next";
import {Inter} from 'next/font/google'

import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { queryProvider as QueryProvider } from "@/components/query-provider";

import { cn } from "@/lib/utils";

const inter = Inter({ subsets : ['latin']})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, "antialiased min-h-screen")}
      >
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
