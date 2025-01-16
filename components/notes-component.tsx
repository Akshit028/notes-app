"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Note, CreateNoteInput } from '@/types/note';

const NotesComponent: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [currentNote, setCurrentNote] = useState<(Note & { id?: string }) | CreateNoteInput>({
        title: '',
        content: ''
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isFullPageMode, setIsFullPageMode] = useState(false);
    const [columnCount, setColumnCount] = useState(2);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        // Check if device supports touch
        const checkTouchDevice = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };

        checkTouchDevice();
        window.addEventListener('resize', checkTouchDevice);
        
        return () => window.removeEventListener('resize', checkTouchDevice);
    }, []);

    // Improved column distribution logic
    const getColumnedNotes = () => {
        const cols = Array.from({ length: columnCount }, () => [] as Note[]);
        notes.forEach((note, index) => {
            cols[index % columnCount].push(note);
        });
        return cols;
    };

    // Responsive layout with debounced resize handler
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setColumnCount(window.innerWidth < 640 ? 1 : 2);
            }, 150); // Debounce resize events
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, []);

    // API calls with proper error handling and loading states
    const fetchNotes = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/notes');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch notes');
            }
            const data: Note[] = await response.json();
            setNotes(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An error occurred';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e?: React.FormEvent): Promise<void> => {
        e?.preventDefault();
        if (!currentNote.title.trim() || !currentNote.content.trim()) {
            setError('Title and content are required');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/notes', {
                method: isEditing ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isEditing ? currentNote : {
                    title: currentNote.title.trim(),
                    content: currentNote.content.trim()
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} note`);
            }

            await response.json();
            resetForm();
            await fetchNotes();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An error occurred';
            setError(message);
        } finally {
            setIsLoading(false);
            setIsFullPageMode(false);
        }
    };

    const handleDelete = async (noteId: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/notes?id=${noteId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete note');
            }

            await fetchNotes();
            setIsDeleteDialogOpen(false);
            setNoteToDelete(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An error occurred';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (note: Note) => {
        setCurrentNote(note);
        setIsEditing(true);
        setIsFullPageMode(true);
        setError(null);
    };

    const handleNewNote = () => {
        setCurrentNote({ title: '', content: '' });
        setIsEditing(false);
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

    useEffect(() => {
        fetchNotes();
    }, []);

    const renderNote = (note: Note) => (
        <Card
            key={note.id}
            className="mb-4 group relative hover:shadow-lg transition-shadow"
        >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 cursor-pointer "
                onClick={() => handleEdit(note)}>
                <CardTitle className="line-clamp-2 py-1 pr-12">{note.title}</CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute right-4 top-3 transition-opacity ${isTouchDevice ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} text-destructive hover:text-destructive/90`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setNoteToDelete(note.id);
                        setIsDeleteDialogOpen(true);
                    }}
                    aria-label={`Delete note: ${note.title}`}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent 
                className="cursor-pointer"
                onClick={() => handleEdit(note)}
            >
                <p className="whitespace-pre-wrap line-clamp-3">{note.content}</p>
                <p className="text-sm text-muted-foreground mt-2">
                    {new Date(note.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </p>
            </CardContent>
        </Card>
    );

    if (isFullPageMode) {
        return (
            <div className="fixed inset-0 bg-background">
                <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
                    <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={resetForm}
                            className="text-muted-foreground"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex items-center"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {isLoading ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </header>

                <main className="flex-1 overflow-auto">
                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-8">
                        <Input
                            name="title"
                            placeholder="Note Title"
                            value={currentNote.title}
                            onChange={handleInputChange}
                            className="text-3xl font-semibold border-none shadow-none mb-8 bg-transparent focus-visible:ring-0"
                            disabled={isLoading}
                        />
                        <Textarea
                            name="content"
                            placeholder="Write your note here..."
                            value={currentNote.content}
                            onChange={handleInputChange}
                            className="min-h-[calc(100vh-250px)] resize-none shadow-none border-none focus-visible:ring-0 text-lg bg-transparent"
                            disabled={isLoading}
                        />
                    </form>
                </main>

                {error && (
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-destructive/10">
                        <p className="text-destructive text-sm max-w-3xl mx-auto">{error}</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative pb-20"> {/* Changed to just relative positioning for button */}
            {isLoading && !notes.length ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <p className="text-muted-foreground">Loading notes...</p>
                </div>
            ) : (
                <>
                    {notes.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">No notes yet</p>
                            <Button onClick={handleNewNote}>Create your first note</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {getColumnedNotes().map((column, columnIndex) => (
                                <div key={columnIndex}>
                                    {column.map(renderNote)}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

                <Button
                    className="sticky bottom-4 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
                    size="icon"
                    onClick={handleNewNote}
                >
                    <Plus className="h-6 w-6" />
                </Button>

                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your note.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => noteToDelete && handleDelete(noteToDelete)}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {error && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-destructive/10">
                    <p className="text-destructive text-sm max-w-3xl mx-auto">{error}</p>
                </div>
            )}
        </div>
    );
};

export default NotesComponent;