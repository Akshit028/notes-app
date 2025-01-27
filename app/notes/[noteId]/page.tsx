import NotesIdComponent from "@/components/notesIdComponent";
import requireAuth from "@/utils/requireAuth";

interface PageProps {
    params: Promise<{
        noteId: string;
    }>;
}

const Page = async ({ params }: PageProps) => {
    await requireAuth();
    return <NotesIdComponent noteId={(await params).noteId} />;
};

export default Page;
