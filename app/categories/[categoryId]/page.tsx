import CategoryContent from "@/components/categoryContent";

interface PageProps {
    params: Promise<{
        categoryId: string;
    }>;
}

const page = async ({ params }: PageProps) => {
    const { categoryId } = await params;
    return <CategoryContent categoryId={categoryId} />;
};

export default page;
