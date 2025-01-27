import { NextResponse } from 'next/server';
import { prisma } from '@/db/index';
import { getServerSession } from 'next-auth';
import options from '@/config/auth';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json([]);
        }

        const notes = await prisma.note.findMany({
            where: {
                userId: session.user.id,
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        content: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(notes);
    } catch (error) {
        console.error('[SEARCH_NOTES_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}