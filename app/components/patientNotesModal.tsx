"use client";

import closeIcon from "../../public/icons/close.svg";
import type { userNote } from "../types";
import NoteCard from "./noteCard";

type Props = {
  patientName: string;
  patientEmail: string;
  notes: userNote[];
  onClose: () => void;
  onSelectNote: (note: userNote) => void;
};

export function PatientNotesModal({
  patientName,
  patientEmail,
  notes,
  onClose,
  onSelectNote,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-5xl flex-col rounded-[30px] bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-4 top-4 hover:cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          <img
            src={typeof closeIcon === "string" ? closeIcon : closeIcon.src}
            alt="close"
            className="size-8 duration-200 hover:size-10"
          />
        </button>

        <div className="mb-6 pr-12">
          <h2 className="font-serif text-4xl text-black md:text-5xl">
            {patientName}
          </h2>
          <p className="mt-1 font-inter text-lg text-[#2B2B2B]">{patientEmail}</p>
          <span className="mt-3 block h-1 w-1/2 rounded-full bg-black" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {notes.length === 0 ? (
            <p className="font-inter text-xl text-[#2B2B2B]">
              No journal notes found for this patient.
            </p>
          ) : (
            <div className="flex flex-wrap gap-6 pb-2">
              {notes.map((note) => (
                <NoteCard
                  key={note.noteId}
                  note={note}
                  onClick={() => onSelectNote(note)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
