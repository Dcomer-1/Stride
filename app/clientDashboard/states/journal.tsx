"use client";

import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { useEffect, useState } from 'react';
import { NoteModal } from '../noteModal';
import { createNote, updateNote, showAllNotes } from '../profileChange';
import { userNote, NoteColor } from '@/app/types';
import NoteCard from '../noteCard';

function toNoteColor(value: string): NoteColor {
    if (value === "red" || value === "yellow" || value === "green" || value === "purple") {
        return value;
    }
    return "green";
}

function mapDbNote(row: {
    id: number | string;
    title: string;
    description: string;
    color: string;
    created_at: string;
}): userNote {
    return {
        noteId: row.id,
        title: row.title,
        description: row.description,
        color: toNoteColor(row.color),
        date: row.created_at,
    };
}

export default function Journal(){
    const [isOpen, setIsOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<userNote | null>(null);
    const [notes, setNotes] = useState<userNote[]>([]);

    async function loadNotes() {
        const result = await showAllNotes();
        if ("notes" in result) {
            setNotes(result.notes.map(mapDbNote));
        }
    }

    useEffect(() => {
        loadNotes();
    }, []);

    function openCreate() {
        setEditingNote(null);
        setIsOpen(true);
    }

    function openEdit(note: userNote) {
        setEditingNote(note);
        setIsOpen(true);
    }

    async function handleSave(note: {
        title: string;
        description: string;
        color: string;
        noteId?: number | string;
    }) {
        if (note.noteId != null) {
            await updateNote(note.title, note.description, note.color, note.noteId);
        } else {
            await createNote(note.title, note.description, note.color);
        }
        setIsOpen(false);
        setEditingNote(null);
        await loadNotes();
    }

    return(
        <div className="w-full flex flex-1 flex-col m-5 md:my-10 p-5 
        rounded-2xl ">
            {isOpen && (
                <NoteModal
                    onClose={() => {
                        setIsOpen(false);
                        setEditingNote(null);
                    }}
                    onSave={handleSave}
                    initialNote={editingNote ?? undefined}
                />
            )}
                 
            {/* Top part | Section Title, Add Note and Filter */}
            <div className="flex w-full gap-5 font-inter ">
                <button
                    onClick={openCreate}
                    className=" text-black text-sm hover:cursor-pointer "
                >
                    <AddCircleOutlineRoundedIcon sx={{color : "black", fontSize : 35, animationDuration: 200,
                    transition: "font-size 100ms ease",
                    "&:hover" : {
                        fontSize: 40
                    }
                    }}/>    
                </button>
                <h2 className="text-black text-7xl font-serif font-medium leading-none">
                    All Notes
                </h2>
                <h2 className="ml-auto text-black text-2xl self-end leading-none">
                    Filter
                </h2>
            </div>
            <div className="mt-3 bg-black h-1 w-3/4 rounded-full"/>

            <div className="mt-8 flex flex-wrap gap-6 duration-200">
                {notes.map((note) => (
                    <NoteCard
                        key={note.noteId}
                        note={note}
                        onClick={() => openEdit(note)}
                    />
                ))}
            </div>
        </div>
    );
}
