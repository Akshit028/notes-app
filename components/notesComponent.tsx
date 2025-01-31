"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Plus } from "lucide-react";

import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNotes } from "@/hooks/useNotes";
import type { CreateNoteInput, Note } from "@/types/types";

import DeleteDialog from "./deleteDialog";
import NoteEditor from "./noteEditor";
import NotesGrid from "./notesGrid";

const NotesComponent = () => {
    const params = useParams();
    const {
        notes,
        isLoading,
        error,
        setError,
        createNote,
        updateNote,
        deleteNote,
    } = useNotes();
    const [currentNote, setCurrentNote] = useState<
        (Note & { id?: string }) | CreateNoteInput
    >({
        title: "",
        content: "",
    });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isFullPageMode, setIsFullPageMode] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        if (params?.noteId && notes.length > 0) {
            const note = notes.find((n) => n.id === params.noteId);
            if (note) {
                setCurrentNote(note);
                setIsEditing(true);
                setIsFullPageMode(true);
            }
        }
    }, [params?.noteId, notes]);

    useEffect(() => {
        const checkTouchDevice = () => {
            setIsTouchDevice(
                "ontouchstart" in window || navigator.maxTouchPoints > 0
            );
        };

        checkTouchDevice();
        window.addEventListener("resize", checkTouchDevice);
        return () => window.removeEventListener("resize", checkTouchDevice);
    }, []);

    const handleSubmit = async (): Promise<void> => {
        if (!currentNote.title.trim() || !currentNote.content.trim()) {
            setError("Title and content are required");
            return;
        }

        try {
            if (isEditing && "id" in currentNote) {
                await updateNote(currentNote as Note);
            } else {
                await createNote({
                    title: currentNote.title.trim(),
                    content: currentNote.content.trim(),
                });
            }
            resetForm();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (note: Note) => {
        setCurrentNote(note);
        setIsEditing(true);
        setIsFullPageMode(true);
        setError(null);
    };

    const handleNewNote = () => {
        setCurrentNote({ title: "", content: "" });
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
        setCurrentNote({ title: "", content: "" });
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
                console.log(error);
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
                <div className="flex min-h-[200px] items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <div>
                    <NotesGrid
                        notes={notes}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                        isTouchDevice={isTouchDevice}
                    />
                </div>
            )}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className="sticky bottom-4 h-14 w-14 rounded-full shadow-lg transition-shadow hover:shadow-xl"
                            size="icon"
                            onClick={handleNewNote}
                        >
                            <Plus className="h-10 w-10" />
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
                <div className="fixed bottom-0 left-0 right-0 bg-destructive/10 p-4">
                    <p className="mx-auto max-w-3xl text-sm text-destructive">
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
};

export default NotesComponent;
