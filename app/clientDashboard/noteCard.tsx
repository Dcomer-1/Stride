"use client";

import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import type { NoteColor, userNote } from "../types";
import {motion} from "framer-motion";

const NOTE_COLORS: Record<NoteColor, string> = {
  red: "#F29191",
  yellow: "#F2D891",
  green: "#A8F291",
  purple: "#9196F2",
};

type Props = {
  note: userNote;
  onClick?: () => void;
};

function formatNoteDate(date?: Date | string) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

export default function NoteCard({ note, onClick }: Props) {
  const borderColor = NOTE_COLORS[note.color] ?? NOTE_COLORS.green;

  return (
    
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .5, ease: 'easeIn'}}
      className="flex w-full max-w-[300px] flex-col rounded-[30px] p-3 pt-5 text-left
        transition duration-200 hover:-translate-y-1 hover:cursor-pointer shadow-md"
      style={{ backgroundColor: borderColor }}

    >
      <div className="mb-2 flex justify-end pr-1">
        <MoreHorizRoundedIcon sx={{ color: "rgba(0,0,0,0.35)", fontSize: 22 }} />
      </div>

      <div className="flex min-h-[280px] flex-col rounded-[30px] bg-white p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="font-inter text-[28px] font-medium leading-tight text-black">
            {note.title || "Untitled"}
          </h3>
          <ModeEditRoundedIcon
            sx={{ color: "black", fontSize: 22, flexShrink: 0, mt: 0.5 }}
          />
        </div>

        <p className="mb-4 font-serif text-xl text-[#2B2B2B]">
          {formatNoteDate(note.date)}
        </p>

        <p className="font-inter line-clamp-4 text-xl leading-snug text-[#2B2B2B]">
          {note.description}
        </p>
      </div>
    </motion.button>
  );
}
