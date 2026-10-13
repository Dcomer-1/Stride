"use client";

import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { useEffect, useState } from 'react';
import { SplitNoteModal } from '../../components/splitNoteModal';
import { createNote, updateNote, showAllNotes } from '../profileChange';
import { getDoctorNoteForClientNote } from '@/app/doctorNotesApi';
import { userNote, NoteColor } from '@/app/types';
import NoteCard from '../../components/noteCard';
import Loading from '@/app/components/loading';

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
    const [doctorNote, setDoctorNote] = useState<userNote | null>(null);
    const [notes, setNotes] = useState<userNote[]>([]);
    const [loading, setLoading] = useState(false);
    const [doctorNoteLoading, setDoctorNoteLoading] = useState(false);

    async function loadNotes() {
        setLoading(true);
        const result = await showAllNotes();
        if ("notes" in result) {
            setNotes(result.notes.map(mapDbNote));
        }
        setLoading(false);
    }

    useEffect(() => {
        loadNotes();
    }, []);

    function openCreate() {
        setEditingNote({ title: "", description: "", color: "red" });
        setDoctorNote(null);
        setIsOpen(true);
    }

    async function openEdit(note: userNote) {
        setEditingNote(note);
        setDoctorNote(null);
        setDoctorNoteLoading(true);
        if (note.noteId != null) {
            const result = await getDoctorNoteForClientNote(note.noteId);
            if (result.note) {
                setDoctorNote(result.note);
            }
        }

        setIsOpen(true);
        setDoctorNoteLoading(false);
    }

    async function handleSaveClient(note: {
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
        <div className="m-3 flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl p-3 md:m-5 md:p-5">
            {
            isOpen && editingNote && (
                <SplitNoteModal
                    onClose={() => {
                        setIsOpen(false);
                        setEditingNote(null);
                        setDoctorNote(null);
                    }}
                    clientNote={editingNote}
                    doctorNote={doctorNote}
                    clientReadOnly={false}
                    doctorReadOnly
                    onSaveClient={handleSaveClient}
                    doctorName={doctorNote?.authorName}
                />
            )}
            { doctorNoteLoading && (
                <div className="fixed text-white inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Loading color="white" />
                </div>
            )}
                 
            {/* Top part | Section Title, Add Note and Filter */}
            <div className="flex w-full shrink-0 flex-wrap items-end gap-3 font-inter md:gap-5">
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
                <h2 className="font-serif text-4xl font-medium leading-none text-black md:text-7xl">
                    All Notes
                </h2>
                {/* <h2 className="ml-auto self-end text-xl leading-none text-black md:text-2xl">
                    Filter
                </h2> */}
            </div>
            <div className="mt-3 h-1 w-3/4 shrink-0 rounded-full bg-black"/>

            <div className="mt-8 min-h-0 flex-1 overflow-y-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="grid grid-cols-1 gap-6 duration-200 sm:grid-cols-2 md:grid-cols-3">
                {loading ? (
                    <Loading />
                ) : (
                    notes.map((note) => (
                    <NoteCard
                        key={note.noteId}
                        note={note}
                        onClick={() => openEdit(note)}
                    />
                )))} 
            </div>
            </div>
        </div>
    );
}
