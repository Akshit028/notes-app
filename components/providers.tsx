"use client";

import React, { ReactNode } from "react";

import { SessionProvider } from "next-auth/react";

import ThemeProvider from "@/components/themeProvider";

const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
    );
};

export default Providers;
