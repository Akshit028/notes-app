import NotesIdComponent from "@/components/notesIdComponent";
import requireAuth from "@/utils/requireAuth";

interface PageProps {
    params: {
        noteId: string;
    };
}

const Page = async ({ params }: PageProps) => {
    await requireAuth();
    return <NotesIdComponent noteId={params.noteId} />;
};

export default Page;
