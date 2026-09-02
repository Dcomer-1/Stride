"use client";

import { useState } from "react";
import saveIcon from "../../public/icons/Save.svg";
import deleteIcon from "../../public/icons/delete.svg";
import { userNote, NoteColor } from "../types";
import { formatNoteDate } from "../util";

const AUTHOR_COLORS: Record<NoteColor, string> = {
  red: "#9D3333",
  yellow: "#9D8133",
  green: "#4C9D33",
  purple: "#43339D",
};

const COLORS: { id: NoteColor; color: string }[] = [
  { id: "red", color: "#F29191" },
  { id: "yellow", color: "#F2D891" },
  { id: "green", color: "#A8F291" },
  { id: "purple", color: "#9196F2" },
] as const;

export type NoteSavePayload = {
  title: string;
  description: string;
  color: string;
  noteId?: number | string;
};

type Props = {
  label?: string;
  initialNote?: userNote;
  readOnly?: boolean;
  onSave?: (note: NoteSavePayload) => void;
  date?: string | Date;
  name?: string;
  showFooter?: boolean;
  titlePlaceholder?: string;
  descriptionPlaceholder?: string;
  className?: string;
  emptyMessage?: string;
};

export function NotePanel({
  label,
  initialNote = { title: "", description: "", color: "red" },
  readOnly = false,
  onSave,
  date,
  name,
  showFooter = true,
  titlePlaceholder = "Title (i.e. What I Ate Today)",
  descriptionPlaceholder = "What Did You Eat Today?",
  className = "",
  emptyMessage,
}: Props) {
  const [title, setTitle] = useState(initialNote.title);
  const [description, setDescription] = useState(initialNote.description);
  const [color, setColor] = useState<NoteColor>(initialNote.color);
  const noteId = initialNote.noteId;
  const activeColor = COLORS.find((c) => c.id === color)?.color ?? COLORS[0].color;
  const authorColor = AUTHOR_COLORS[color] ?? AUTHOR_COLORS.red;
  const isEmpty = !title && !description && Boolean(emptyMessage);

  return (
    <div
      className={`flex min-h-0 flex-col rounded-4xl p-4 pt-8 max-h-[90vh] ${className}`}
      style={{ background: activeColor }}
    >
      {label && (
        <p className="mb-2 px-2 font-inter text-sm font-semibold uppercase tracking-wide text-black/70">
          {label}
        </p>
      )}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-lg">
        {!readOnly && (
          <div className="mb-2 flex shrink-0 gap-2">
            {COLORS.map(({ id, color: swatch }) => (
              <button
                key={id}
                type="button"
                className="h-4 w-4 rounded-full hover:cursor-pointer"
                style={{ background: swatch }}
                onClick={() => setColor(id)}
              />
            ))}
          </div>
        )}

        {readOnly ? (
          <div className="shrink-0">
            <h3 className="text-3xl font-medium leading-tight md:text-4xl">
              {title || "Untitled"}
            </h3>
            <h4 className="my-2 font-serif text-xl">{formatNoteDate(date)}</h4>
          </div>
        ) : (
          <input
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            placeholder={titlePlaceholder}
            className="mb-3 w-full shrink-0 rounded-xl border-2 border-gray-300 p-2 focus:outline-none"
          />
        )}

        {isEmpty ? (
          <p className="mt-3 text-lg text-gray-500">{emptyMessage}</p>
        ) : readOnly ? (
          <p className="mt-3 min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap text-xl md:text-2xl">
            {description}
          </p>
        ) : (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            placeholder={descriptionPlaceholder}
            rows={12}
            className="min-h-0 flex-1 resize-none rounded-xl border-2 border-gray-300 p-2 focus:outline-none"
          />
        )}

        {!readOnly && onSave && (
          <div className="mt-3 flex shrink-0 justify-end gap-1 font-inter text-sm font-medium">
            <button
              type="button"
              className="mr-1 inline-flex items-center justify-center gap-1 rounded-md bg-[#D93737] p-1 text-white shadow-sm hover:cursor-pointer hover:p-2"
            >
              <img
                src={typeof deleteIcon === "string" ? deleteIcon : deleteIcon.src}
                alt="delete icon"
                className="size-4"
              />
              Delete
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1 rounded-md bg-[#45733F] p-1 text-white hover:cursor-pointer hover:bg-[#3A6235] hover:p-2"
              onClick={() => {
                if (noteId != null) {
                  onSave({ title, description, color, noteId });
                } else {
                  onSave({ title, description, color });
                }
              }}
            >
              <img
                src={typeof saveIcon === "string" ? saveIcon : saveIcon.src}
                alt="save icon"
                className="size-4"
              />
              Save
            </button>
          </div>
        )}
      </div>

      {showFooter && name && (
        <p
          className="mt-3 h-6 shrink-0 self-end pr-2 font-inter text-base font-medium"
          style={{ color: authorColor }}
        >
          Name: {name}
        </p>
      )}
    </div>
  );
}
