import NotesComponent from '@/components/notes-component';
import options from '@/config/auth'
import requireAuth from '@/utils/require-auth';
import type { NextPage } from 'next';
import { getServerSession } from 'next-auth'
import React from 'react'

const Page: NextPage = async () => {
    await requireAuth();
    const session = (await getServerSession(options))!;
    if (!session?.user) return null;

    return (
        <div>
            <NotesComponent />
        </div>
    );
}

export default Page;