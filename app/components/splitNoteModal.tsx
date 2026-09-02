"use client";

import closeIcon from "../../public/icons/close.svg";
import { userNote } from "../types";
import { NotePanel, NoteSavePayload } from "./notePanel";

type Props = {
  onClose: () => void;
  clientNote: userNote;
  doctorNote?: userNote | null;
  clientReadOnly?: boolean;
  doctorReadOnly?: boolean;
  onSaveClient?: (note: NoteSavePayload) => void | Promise<void>;
  onSaveDoctor?: (note: NoteSavePayload) => void | Promise<void>;
  clientName?: string;
  doctorName?: string;
};

export function SplitNoteModal({
  onClose,
  clientNote,
  doctorNote,
  clientReadOnly = true,
  doctorReadOnly = true,
  onSaveClient,
  onSaveDoctor,
  clientName,
  doctorName,
}: Props) {
  const hasDoctorNote =
    Boolean(doctorNote?.title || doctorNote?.description || doctorNote?.noteId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-7xl flex-col gap-4 md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute -top-2 right-0 z-10 hover:cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          <img
            src={typeof closeIcon === "string" ? closeIcon : closeIcon.src}
            alt="close"
            className=" mt-4 mr-4 size-8 hover:size-10 duration-200"
          />
        </button>

        <NotePanel
          key={`client-${clientNote.noteId ?? "new"}`}
          label="Client Note"
          className="min-w-0 flex-1"
          initialNote={clientNote}
          readOnly={clientReadOnly}
          onSave={onSaveClient}
          date={clientNote.date}
          name={clientName ?? clientNote.authorName}
          showFooter={Boolean(clientName ?? clientNote.authorName)}
        />

        <NotePanel
          key={`doctor-${doctorNote?.noteId ?? "new"}`}
          label="Doctor's Note"
          className="min-w-0 flex-1"
          initialNote={
            doctorNote ?? { title: "", description: "", color: "green" }
          }
          readOnly={doctorReadOnly}
          onSave={onSaveDoctor}
          date={doctorNote?.date}
          name={doctorName ?? doctorNote?.authorName}
          showFooter={Boolean(doctorName ?? doctorNote?.authorName)}
          titlePlaceholder="Clinical note title"
          descriptionPlaceholder="Provider observations and recommendations"
          emptyMessage={
            doctorReadOnly && !hasDoctorNote
              ? "No doctor's note for this entry yet."
              : undefined
          }
        />
      </div>
    </div>
  );
}
