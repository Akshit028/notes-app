"use client";

import { useEffect, useState } from 'react';
import { Category, Note, CreateNoteInput } from '@/types/types';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Loading from '@/app/loading';
import NoteEditor from '@/components/noteEditor';
import DeleteDialog from '@/components/deleteDialog';
import { useNotes } from '@/hooks/useNotes';
import NoteCard from '@/components/noteCard';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';


interface CategoryContentProps {
    categoryId: string;
}

const CategoryContent = ({ categoryId }: CategoryContentProps) => {
    const { updateNote } = useNotes();
    const [category, setCategory] = useState<Category | null>(null);
    const [categoryNotes, setCategoryNotes] = useState<Note[]>([]);
    const [allNotes, setAllNotes] = useState<Note[]>([]);
    const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState<(Note & { id?: string }) | CreateNoteInput>({
        title: '',
        content: ''
    });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isFullPageMode, setIsFullPageMode] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkTouchDevice = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };

        checkTouchDevice();
        window.addEventListener('resize', checkTouchDevice);
        return () => window.removeEventListener('resize', checkTouchDevice);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!categoryId) {
                setError('Category ID is missing');
                setIsLoading(false);
                return;
            }

            try {
                // Fetch category
                const categoryResponse = await fetch(`/api/categories/${categoryId}`);
                if (!categoryResponse.ok) throw new Error('Failed to fetch category');
                const categoryData = await categoryResponse.json();
                setCategory(categoryData);

                // Fetch notes in this category
                const categoryNotesResponse = await fetch(`/api/categories/${categoryId}/notes`);
                if (!categoryNotesResponse.ok) throw new Error('Failed to fetch category notes');
                const categoryNotesData = await categoryNotesResponse.json();
                setCategoryNotes(categoryNotesData);

                // Fetch all user notes
                const allNotesResponse = await fetch('/api/notes');
                if (!allNotesResponse.ok) throw new Error('Failed to fetch notes');
                const allNotesData = await allNotesResponse.json();
                setAllNotes(allNotesData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
                console.error('Error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [categoryId]);

    const handleSubmit = async (): Promise<void> => {
        if (!currentNote.title.trim() || !currentNote.content.trim()) {
            setError('Title and content are required');
            return;
        }

        try {
            if (isEditing && 'id' in currentNote) {
                await updateNote(currentNote as Note);
                // Refresh category notes after update
                const response = await fetch(`/api/categories/${categoryId}/notes`);
                if (response.ok) {
                    const updatedNotes = await response.json();
                    setCategoryNotes(updatedNotes);
                }
            }
            resetForm();
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const handleEdit = (note: Note) => {
        setCurrentNote(note);
        setIsEditing(true);
        setIsFullPageMode(true);
        setError(null);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setError(null);
        setCurrentNote((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setCurrentNote({ title: '', content: '' });
        setIsEditing(false);
        setIsFullPageMode(false);
        setError(null);
    };

    const handleDeleteClick = (noteId: string) => {
        setNoteToDelete(noteId);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (noteToDelete) {
            try {
                const response = await fetch(`/api/categories/${categoryId}/notes/${noteToDelete}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to remove note from category');
                }
                // Remove note from category notes
                setCategoryNotes(prev => prev.filter(note => note.id !== noteToDelete));
                setIsDeleteDialogOpen(false);
                setNoteToDelete(null);
            } catch (error) {
                console.error('Error deleting note:', error);
            }
        }
    };

    const handleNoteSelection = (noteId: string) => {
        setSelectedNotes(prev =>
            prev.includes(noteId)
                ? prev.filter(id => id !== noteId)
                : [...prev, noteId]
        );
    };

    const handleAssignNotes = async () => {
        try {
            const response = await fetch(`/api/categories/${categoryId}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ noteIds: selectedNotes }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const updatedNotes = await response.json();
            setCategoryNotes(updatedNotes);
            setSelectedNotes([]);
            setOpen(false);
        } catch (error) {
            console.error('Error assigning notes:', error);
        }
    };

    const handleGoBack = () => {
        router.push('/categories');
    }

    if (isLoading) return <Loading />;

    if (error || !category) {
        return (
            <div className="p-4 text-red-500 flex items-center justify-center">
                {error || 'Category not found'}
            </div>
        );
    }

    if (isFullPageMode) {
        return (
            <NoteEditor
                note={currentNote}
                isLoading={isLoading}
                error={error}
                onSave={handleSubmit}
                onClose={resetForm}
                onChange={handleInputChange}
            />
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleGoBack}
                    className="mr-4"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-2xl font-bold">{category.name}</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>Add Notes</Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className='flex items-start'>Add Notes to Category</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            {allNotes.length === 0 ? (
                                <p className="text-center text-gray-500">No notes available</p>
                            ) : (
                                <div className="space-y-2">
                                    {allNotes.map((note) => (
                                        <div key={note.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-[#27272A] rounded">
                                            <Checkbox
                                                id={note.id}
                                                checked={selectedNotes.includes(note.id)}
                                                onCheckedChange={() => handleNoteSelection(note.id)}
                                            />
                                            <div className="flex-1">
                                                <Label htmlFor={note.id} className="font-medium">
                                                    {note.title}
                                                </Label>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {note.content.substring(0, 100)}
                                                    {note.content.length > 100 ? '...' : ''}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {allNotes.length > 0 && (
                                <Button
                                    onClick={handleAssignNotes}
                                    disabled={selectedNotes.length === 0}
                                >
                                    Add Selected Notes
                                </Button>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryNotes.map((note) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                        isTouchDevice={isTouchDevice}
                    />
                ))}
            </div>

            <DeleteDialog
                isOpen={isDeleteDialogOpen}
                isLoading={isLoading}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                description='This will delete the note from this category.'
            />

            {error && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-destructive/10">
                    <p className="text-destructive text-sm max-w-3xl mx-auto">{error}</p>
                </div>
            )}
        </div>
    );
};

export default CategoryContent;