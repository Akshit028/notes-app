import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import options from "@/config/auth";
import { prisma } from "@/db/index";

export async function GET(
    req: Request,
    { params }: { params: { categoryId: string } }
) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
        }

        const category = await prisma.category.findUnique({
            where: {
                id: params.categoryId,
                userId: session.user.id,
            },
        });

        if (!category) {
            return new NextResponse("Category not found", { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error("[CATEGORY_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { categoryId: string } }
) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: "Category name is required" },
                { status: 400 }
            );
        }

        const updatedCategory = await prisma.category.update({
            where: { id: params.categoryId },
            data: { name },
        });

        return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error) {
        console.error("Category update error:", error);
        return NextResponse.json(
            { error: "Failed to update category" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: { categoryId: string } }
) {
    try {
        await prisma.category.delete({
            where: { id: params.categoryId },
        });

        return NextResponse.json(
            { message: "Category deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Category deletion error:", error);
        return NextResponse.json(
            { error: "Failed to delete category" },
            { status: 500 }
        );
    }
}
