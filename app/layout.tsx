import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import options from "@/config/auth";
import ProfileMenu from "@/components/profileMenu";
import ModeToggle from "@/components/modeToggle";
import CategoriesButton from "@/components/categoriesButton";
import Link from "next/link";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notes",
  description: "Notes app with categarization",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await getServerSession(options);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} antialiased`}
      >
        <Providers>
          <Suspense>
            <div className="min-h-screen flex flex-col items-center">
              <div className="container mx-auto px-4 max-w-3xl">
                <header className="flex justify-between items-center my-8">
                  <Link href={"/notes"} className="text-2xl font-semibold">Notes</Link>
                  <div className="flex justify-between gap-2 items-center">
                    {session?.user && <CategoriesButton />}
                    <ModeToggle />
                    {session?.user && <ProfileMenu />}
                  </div>
                </header>
                <main>{children}</main>
              </div>
            </div>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;