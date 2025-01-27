import type { NextPage } from "next";
import React from "react";

import { getServerSession } from "next-auth";

import NotesComponent from "@/components/notesComponent";
import options from "@/config/auth";
import requireAuth from "@/utils/requireAuth";

const Page: NextPage = async () => {
    await requireAuth();
    const session = (await getServerSession(options))!;
    if (!session?.user) return null;

    return (
        <div>
            <NotesComponent />
        </div>
    );
};

export default Page;
