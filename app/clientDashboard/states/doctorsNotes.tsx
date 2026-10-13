"use client";

import { useEffect, useState } from "react";
import { SplitNoteModal } from "../../components/splitNoteModal";
import NoteCard from "../../components/noteCard";
import { getDoctorNotesForPatient } from "@/app/doctorNotesApi";
import { showAllNotes } from "../profileChange";
import { userNote, NoteColor } from "@/app/types";
import Loading from "@/app/components/loading";

function toNoteColor(value: string): NoteColor {
  if (
    value === "red" ||
    value === "yellow" ||
    value === "green" ||
    value === "purple"
  ) {
    return value;
  }
  return "green";
}

function mapClientNote(row: {
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

export default function DoctorsNotePage() {
  const [doctorsNotes, setDoctorsNotes] = useState<userNote[]>([]);
  const [personalNotes, setPersonalNotes] = useState<userNote[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [doctorNote, setDoctorNote] = useState<userNote | null>(null);
  const [clientNote, setClientNote] = useState<userNote | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadDoctorNotes() {
    setLoading(true);
    const result = await getDoctorNotesForPatient();
    if (result.error) {
      console.error("getDoctorNotesForPatient:", result.error);
      setLoadError(result.error);
      setDoctorsNotes([]);
      return;
    }
    setLoadError(null);
    setDoctorsNotes(result.notes);
    setLoading(false);
  }

  async function loadPersonalNotes() {
    setLoading(true);
    const result = await showAllNotes();
    if ("notes" in result && result.notes) {
      setPersonalNotes(result.notes.map(mapClientNote));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadDoctorNotes();
    loadPersonalNotes();
  }, []);

  function openDoctorNote(note: userNote) {
    const linkedClientNote = personalNotes.find(
      (client) => client.noteId === note.clientNoteId,
    );

    setDoctorNote(note);
    setClientNote(
      linkedClientNote ?? {
        title: "Linked journal note unavailable",
        description: "",
        color: "green",
        noteId: note.clientNoteId,
      },
    );
    setIsOpen(true);
  }

  return (
    <div className="m-3 flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl p-3 md:m-5 md:p-5">
      {isOpen && clientNote && doctorNote && (
        <SplitNoteModal
          onClose={() => {
            setIsOpen(false);
            setDoctorNote(null);
            setClientNote(null);
          }}
          clientNote={clientNote}
          doctorNote={doctorNote}
          clientReadOnly
          doctorReadOnly
          doctorName={doctorNote.authorName}
        />
      )}

      <div className="flex w-full shrink-0 gap-5 font-inter">
        <h2 className="font-serif text-5xl font-medium leading-none text-black md:text-7xl">
          Doctor&apos;s Notes
        </h2>
      </div>
      <div className="mt-3 h-1 w-3/4 shrink-0 rounded-full bg-black" />

      {loadError && (
        <p className="mt-4 font-inter text-base text-[#D93737]">{loadError}</p>
      )}

      <div className="mt-8 min-h-0 flex-1 overflow-y-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="grid grid-cols-1 gap-6 duration-200 sm:grid-cols-2 md:grid-cols-3">
        {loading ? (
          <Loading />
        ) : (
          doctorsNotes.length === 0 && !loadError ? (
          <p className="font-inter text-xl text-[#2B2B2B]">
            No doctor&apos;s notes yet.
          </p>
        ) : (
          doctorsNotes.map((note) => (
            <NoteCard
              key={note.noteId}
              note={note}
              onClick={() => openDoctorNote(note)}
            />
          ))
        ))}
      </div>
      </div>
    </div>
  );
}
