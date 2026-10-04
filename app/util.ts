import type { NoteColor, userNote } from "./types";

export function formatNoteDate(date?: Date | string) {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return "";
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  }

export function toNoteColor(value: string): NoteColor {
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

export function mapDoctorNote(row: {
  id: number | string;
  title: string;
  description: string;
  color: string;
  created_at: string;
  author_name?: string;
  client_note_id?: number | string;
}): userNote {
  return {
    noteId: row.id,
    title: row.title,
    description: row.description,
    color: toNoteColor(row.color),
    date: row.created_at,
    authorName: row.author_name,
    clientNoteId: row.client_note_id,
  };
}
