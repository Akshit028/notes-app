import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";

import { getServerSession } from "next-auth";

import CategoriesButton from "@/components/categoriesButton";
import ModeToggle from "@/components/modeToggle";
import ProfileMenu from "@/components/profileMenu";
import Providers from "@/components/providers";
import SearchComponent from "@/components/searchComponent";
import { Toaster } from "@/components/ui/toaster";
import options from "@/config/auth";

import "./globals.css";

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
            <body className={`${poppins.variable} antialiased`}>
                <Providers>
                    <Suspense>
                        <div className="flex min-h-screen flex-col items-center">
                            <div className="container mx-auto max-w-3xl px-4">
                                <header className="flex flex-col">
                                    <div className="mb-2 mt-8 flex items-center justify-between">
                                        <Link
                                            href={"/notes"}
                                            className="text-3xl font-semibold"
                                        >
                                            Notes
                                        </Link>
                                        <div className="flex items-center gap-4">
                                            <ModeToggle />
                                            {session?.user && <ProfileMenu />}
                                        </div>
                                    </div>
                                    <div className="mb-8 flex items-center justify-between gap-4">
                                        {session?.user && <SearchComponent />}
                                        {session?.user && <CategoriesButton />}
                                    </div>
                                </header>
                                <main>{children}</main>
                                <Toaster />
                            </div>
                        </div>
                    </Suspense>
                </Providers>
            </body>
        </html>
    );
};

export default RootLayout;
