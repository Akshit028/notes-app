import { NextResponse } from 'next/server';
import { prisma } from '@/db/index';
import { getServerSession } from 'next-auth';
import options from '@/config/auth';

export async function GET(
    req: Request,
    { params }: { params: { categoryId: string } }
) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Ensure categoryId exists
        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
        }

        const category = await prisma.category.findUnique({
            where: {
                id: params.categoryId,
                userId: session.user.id
            }
        });

        if (!category) {
            return new NextResponse("Category not found", { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error('[CATEGORY_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
