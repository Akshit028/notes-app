// components/NotesComponent.
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Plus } from 'lucide-react';
import NoteEditor from './noteEditor';
import DeleteDialog from './deleteDialog';
import NotesGrid from './notesGrid';
import { useNotes } from '@/hooks/useNotes';
import type { Note, CreateNoteInput } from '@/types/types';
import Loading from '@/app/loading';

const NotesComponent = () => {
    const { notes, isLoading, error, setError, createNote, updateNote, deleteNote } = useNotes();
    const [currentNote, setCurrentNote] = useState<(Note & { id?: string }) | CreateNoteInput>({
        title: '',
        content: ''
    });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isFullPageMode, setIsFullPageMode] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const checkTouchDevice = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };

        checkTouchDevice();
        window.addEventListener('resize', checkTouchDevice);
        return () => window.removeEventListener('resize', checkTouchDevice);
    }, []);

    const handleSubmit = async (): Promise<void> => {
        if (!currentNote.title.trim() || !currentNote.content.trim()) {
            setError('Title and content are required');
            return;
        }

        try {
            if (isEditing && 'id' in currentNote) {
                await updateNote(currentNote as Note);
            } else {
                await createNote({
                    title: currentNote.title.trim(),
                    content: currentNote.content.trim()
                });
            }
            resetForm();
        } catch (error) {
            // Error is handled in the hook
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

    const handleDeleteClick = (noteId: string) => {
        setNoteToDelete(noteId);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (noteToDelete) {
            try {
                await deleteNote(noteToDelete);
                setIsDeleteDialogOpen(false);
                setNoteToDelete(null);
            } catch (error) {
                // Error is handled in the hook
            }
        }
    };

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
        <div className="relative pb-20">
            {isLoading && !notes.length ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <Loading />
                </div>
            ) : notes.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No notes yet</p>
                    <Button onClick={handleNewNote}>Create your first note</Button>
                </div>
            ) : (
                <NotesGrid
                    notes={notes}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    isTouchDevice={isTouchDevice}
                />
            )}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className="sticky bottom-4 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
                            size="icon"
                            onClick={handleNewNote}
                        >
                            <Plus className='h-10 w-10'/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Add New Note</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>


            <DeleteDialog
                isOpen={isDeleteDialogOpen}
                isLoading={isLoading}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />

            {error && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-destructive/10">
                    <p className="text-destructive text-sm max-w-3xl mx-auto">{error}</p>
                </div>
            )}
        </div>
    );
};

export default NotesComponent;




