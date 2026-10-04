"use client";

import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import type { NoteColor, userNote } from "../types";
import {motion} from "framer-motion";
import { formatNoteDate } from "../util";
import { cn } from "@/lib/utils";


const NOTE_COLORS: Record<NoteColor, string> = {
  red: "#F29191",
  yellow: "#F2D891",
  green: "#A8F291",
  purple: "#9196F2",
};

const AUTHOR_COLORS: Record<NoteColor, string> = {
  red: "#9D3333",
  yellow: "#9D8133",
  green: "#4C9D33",
  purple: "#43339D",
};

type Props = {
  note: userNote;
  onClick?: () => void;
  fill?: boolean;
};



export default function NoteCard({ note, onClick, fill = false }: Props) {
  const borderColor = NOTE_COLORS[note.color] ?? NOTE_COLORS.green;
  const authorColor = AUTHOR_COLORS[note.color] ?? AUTHOR_COLORS.green;
  const isProviderCard = Boolean(note.authorName);

  return (
    
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .5, ease: 'easeIn'}}
      className={cn(
        "flex w-full min-w-[320px] flex-col rounded-[30px] p-3 pt-5 text-left shadow-md transition duration-200 hover:-translate-y-1 hover:cursor-pointer",
        fill ? "h-full min-h-0 overflow-hidden" : isProviderCard ? "h-[320px]" : "",
      )}
      style={{ backgroundColor: borderColor }}
    >
      <div className="mb-2 flex shrink-0 justify-end pr-1">
        <MoreHorizRoundedIcon sx={{ color: "rgba(0,0,0,0.35)", fontSize: 22 }} />
      </div>

      <div
        className={cn(
          "flex flex-col rounded-[30px] bg-white p-6",
          fill || isProviderCard ? "min-h-0 flex-1 overflow-hidden" : "min-h-[280px]",
        )}
      >
        <div className="mb-3 flex w-full min-w-0 shrink-0 items-start justify-between gap-3">
          <h3 className={cn(
            "min-w-0 break-words font-inter text-[28px] font-medium leading-tight text-black",
            fill || isProviderCard ? "line-clamp-2" : "",
          )}>
            {note.title || "Untitled"}
          </h3>
          {isProviderCard ? (
            <MenuBookRoundedIcon
              sx={{ color: "black", fontSize: 22, flexShrink: 0, mt: 0.5 }}
            />
          ) : (
            <ModeEditRoundedIcon
              sx={{ color: "black", fontSize: 22, flexShrink: 0, mt: 0.5 }}
            />
          )}
        </div>

        <p className="mb-4 shrink-0 font-serif text-xl text-[#2B2B2B]">
          {formatNoteDate(note.date)}
        </p>

        {fill ? (
          <div className="w-full min-w-0 shrink-0">
            <p className={cn(
              "w-full break-words font-inter text-xl leading-snug text-[#2B2B2B]",
              isProviderCard ? "line-clamp-3" : "line-clamp-4",
            )}>
              {note.description}
            </p>
          </div>
        ) : (
          <p className={`font-inter text-xl leading-snug text-[#2B2B2B] ${isProviderCard ? "line-clamp-3 min-h-0 overflow-hidden" : "line-clamp-4"}`}>
            {note.description}
          </p>
        )}
      </div>

      {isProviderCard && (
        <p
          className="mt-3 h-6 shrink-0 self-end pr-2 font-inter text-base font-medium"
          style={{ color: authorColor }}
        >
          Name: {note.authorName}
        </p>
      )}
    </motion.button>
  );
}
