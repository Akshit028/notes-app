import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import options from "@/config/auth";
import { prisma } from "@/db/index";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        const category = await prisma.category.create({
            data: {
                name,
                userId: session.user.id,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("[CATEGORIES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const categories = await prisma.category.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("[CATEGORIES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
