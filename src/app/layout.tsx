import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "Personal Finance",
  description: "Track your finances",
  icons: [
    {
      rel: "icon",
      url: "https://2oooptzs26.ufs.sh/f/4ti4KJ0DJmjeFFxts5GJpMrSYuIDqk62zEvfRmUQ04cZLesh",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
          <SignedIn>
            <NuqsAdapter>
              <Toaster />
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <div className="flex h-full flex-col gap-4 p-4 pt-0">
                    {children}
                  </div>
                </SidebarInset>
              </SidebarProvider>
            </NuqsAdapter>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
