"use client";

import closeIcon from "../../public/icons/close.svg";
import { userNote } from "../types";
import { NotePanel, NoteSavePayload } from "./notePanel";

type Props = {
  onClose: () => void;
  onSave: (note: NoteSavePayload) => void;
  initialNote?: userNote;
  readOnlyView?: boolean;
  date?: string | Date;
  name?: string;
};

export function NoteModal({
  onClose,
  onSave,
  initialNote = { title: "", description: "", color: "red" },
  readOnlyView = false,
  date,
  name,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <NotePanel
          initialNote={initialNote}
          readOnly={readOnlyView}
          onSave={
            readOnlyView
              ? undefined
              : (note) => {
                  onSave(note);
                  onClose();
                }
          }
          date={date}
          name={name}
        />
        <button
          type="button"
          className="absolute right-6 top-12 hover:cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          <img
            src={typeof closeIcon === "string" ? closeIcon : closeIcon.src}
            alt="close"
            className="size-8 hover:size-10"
          />
        </button>
      </div>
    </div>
  );
}
