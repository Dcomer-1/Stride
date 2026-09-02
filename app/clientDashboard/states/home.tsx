"use client";

import { NoteColor, userNote } from "@/app/types";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createNote, showAllNotes, updateNote } from "../profileChange";
import NoteCard from "../../components/noteCard";
import { SplitNoteModal } from "../../components/splitNoteModal";
import { getDoctorNoteForClientNote, getDoctorNotesForPatient } from "@/app/doctorNotesApi";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

type NoteFilter = "today" | "week" | "month";

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

function formatMonthLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatNoteDate(date?: Date | string) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

function formatNoteDateMonth(date?: Date | string) {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return "";
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${month}`;
  }

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<userNote | null>(null);
  const [doctorNote, setDoctorNote] = useState<userNote | null>(null);
  const [clientReadOnly, setClientReadOnly] = useState(false);
  const [personalNotes, setPersonalNotes] = useState<userNote[]>([]);
  const [doctorNotes, setDoctorNotes] = useState<userNote[]>([]);
  const [filter, setFilter] = useState<NoteFilter>("week");
  const [monthCursor, setMonthCursor] = useState(() => new Date());
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [doctorCarouselApi, setDoctorCarouselApi] = useState<CarouselApi>();
  const [doctorCanScrollPrev, setDoctorCanScrollPrev] = useState(false);
  const [doctorCanScrollNext, setDoctorCanScrollNext] = useState(false);

  async function loadNotes() {
    const result = await showAllNotes();
    if ("notes" in result) {
      setPersonalNotes(result.notes.map(mapDbNote));
    }
  }

  async function loadDoctorNotes() {
    const result = await getDoctorNotesForPatient();
    if (result.error) {
      console.error("getDoctorNotesForPatient:", result.error);
      setDoctorNotes([]);
      return;
    }
    setDoctorNotes(result.notes);
  }

  useEffect(() => {
    loadNotes();
    loadDoctorNotes();
  }, []);

  function todayFilter(notes: userNote[]) {
    const todayDate = formatNoteDate(new Date());
    return notes.filter(
      (note) => formatNoteDate(note.date) === todayDate,
    );
  }

  function monthFilter(notes: userNote[]) {
    const currentMonth = formatNoteDateMonth(new Date());
    return notes.filter(
      (note) => formatNoteDateMonth(note.date) === currentMonth,
    );
  }

  function weekFilter(notes: userNote[]){
    const today = new Date();
    const cutoff = new Date(today);
    cutoff.setDate(today.getDate() - 7 );
    return notes.filter(
        (note) => {
            if (note.date == null) return false;
            const noteTime = new Date(note.date).getTime();
            return noteTime >= cutoff.getTime() && noteTime <= today.getTime();
        });
  }

  const FILTERS: {
    id: NoteFilter;
    label: string;
    filter?: (notes: userNote[]) => userNote[];
  }[] = [
    { id: "today", label: "Today", filter: todayFilter },
    { id: "week", label: "This Week", filter: weekFilter },
    { id: "month", label: "This Month", filter: monthFilter },
  ];

  // Derived each render from filter state + personalNotes
  const activeFilter = FILTERS.find((f) => f.id === filter);
  const visibleNotes =
    activeFilter?.filter?.(personalNotes) ?? personalNotes;
  const visibleDoctorNotes =
    activeFilter?.filter?.(doctorNotes) ?? doctorNotes;

  useEffect(() => {
    if (!carouselApi) return;

    const syncOverflow = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    syncOverflow();
    carouselApi.on("select", syncOverflow);
    carouselApi.on("reInit", syncOverflow);
    carouselApi.on("settle", syncOverflow);

    return () => {
      carouselApi.off("select", syncOverflow);
      carouselApi.off("reInit", syncOverflow);
      carouselApi.off("settle", syncOverflow);
    };
  }, [carouselApi, visibleNotes.length]);

  useEffect(() => {
    if (!doctorCarouselApi) return;

    const syncOverflow = () => {
      setDoctorCanScrollPrev(doctorCarouselApi.canScrollPrev());
      setDoctorCanScrollNext(doctorCarouselApi.canScrollNext());
    };

    syncOverflow();
    doctorCarouselApi.on("select", syncOverflow);
    doctorCarouselApi.on("reInit", syncOverflow);
    doctorCarouselApi.on("settle", syncOverflow);

    return () => {
      doctorCarouselApi.off("select", syncOverflow);
      doctorCarouselApi.off("reInit", syncOverflow);
      doctorCarouselApi.off("settle", syncOverflow);
    };
  }, [doctorCarouselApi, visibleDoctorNotes.length]);

  function openCreate() {
    setClientReadOnly(false);
    setEditingNote({ title: "", description: "", color: "red" });
    setDoctorNote(null);
    setIsOpen(true);
  }

  async function openEdit(note: userNote) {
    setClientReadOnly(false);
    setEditingNote(note);
    setDoctorNote(null);

    if (note.noteId != null) {
      const result = await getDoctorNoteForClientNote(note.noteId);
      if (result.note) {
        setDoctorNote(result.note);
      }
    }

    setIsOpen(true);
  }

  function openDoctorNote(note: userNote) {
    const linkedClientNote = personalNotes.find(
      (clientNote) => clientNote.noteId === note.clientNoteId,
    );

    setClientReadOnly(true);
    setEditingNote(
      linkedClientNote ?? {
        title: "Linked client note unavailable",
        description: "",
        color: "green",
        noteId: note.clientNoteId,
      },
    );
    setDoctorNote(note);
    setIsOpen(true);
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

  function goToPreviousMonth() {
    setMonthCursor((current) => {
      const next = new Date(current);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  }

  function goToNextMonth() {
    setMonthCursor((current) => {
      const next = new Date(current);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  }

  return (
    <motion.div className="m-3 flex w-full flex-1 flex-col rounded-2xl p-5">
      <div className="mb-8 flex flex-col gap-3">
        <h2 className="font-serif text-4xl font-light text-black md:text-[96px]">
          MY DIET NOTES
        </h2>
        <span className="inset-x-0 -bottom-0.5 h-[4px] w-3/4 rounded-full bg-black" />
      </div>

      {isOpen && editingNote && (
        <SplitNoteModal
          onClose={() => {
            setIsOpen(false);
            setEditingNote(null);
            setDoctorNote(null);
          }}
          clientNote={editingNote}
          doctorNote={doctorNote}
          clientReadOnly={clientReadOnly}
          doctorReadOnly
          onSaveClient={clientReadOnly ? undefined : handleSaveClient}
          doctorName={doctorNote?.authorName}
        />
      )}

      <div className="mb-8 flex flex-col gap-6">
        <h2 className="font-serif text-4xl text-black md:text-[40px]">
          Doctor&apos;s Diet Notes
        </h2>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-8 font-inter text-xl font-medium">
            {FILTERS.map(({ id, label }) => {
              const active = filter === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className={`relative pb-1 hover:cursor-pointer ${
                    active ? "text-black" : "text-[#2B2B2B]"
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-0.5 h-[3px] rounded-full bg-black" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <Carousel
          setApi={setDoctorCarouselApi}
          opts={{ align: "start", containScroll: "trimSnaps" }}
          className="w-full"
        >
          <div
            className="min-w-0"
            style={{
              WebkitMaskImage: `linear-gradient(to right, ${
                doctorCanScrollPrev ? "transparent 0%, black 2.5rem" : "black 0%"
              }, ${
                doctorCanScrollNext
                  ? "black calc(100% - 2.5rem), transparent 100%"
                  : "black 100%"
              })`,
              maskImage: `linear-gradient(to right, ${
                doctorCanScrollPrev ? "transparent 0%, black 2.5rem" : "black 0%"
              }, ${
                doctorCanScrollNext
                  ? "black calc(100% - 2.5rem), transparent 100%"
                  : "black 100%"
              })`,
            }}
          >
            <CarouselContent className="-ml-4 items-stretch p-3 min-h-[320px]">
              {visibleDoctorNotes.map((note) => (
                <CarouselItem
                  key={note.noteId}
                  className="basis-[300px] pl-4 md:basis-[320px]"
                >
                  <NoteCard note={note} onClick={() => openDoctorNote(note)} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
        </Carousel>
      </div>

      <div className="mb-8 flex flex-col gap-6">
        <h2 className="font-serif text-4xl text-black md:text-[40px]">
          My Notes
        </h2>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-8 font-inter text-xl font-medium">
            {FILTERS.map(({ id, label }) => {
              const active = filter === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className={`relative pb-1 hover:cursor-pointer ${
                    active ? "text-black" : "text-[#2B2B2B]"
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-0.5 h-[3px] rounded-full bg-black" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 font-inter text-sm font-medium text-[#2B2B2B]">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full text-black"
              onClick={goToPreviousMonth}
              aria-label="Previous month"
            >
              <ChevronLeftRoundedIcon sx={{ fontSize: 22 }} />
            </Button>
            <span className="min-w-[90px] text-center">
              {formatMonthLabel(monthCursor)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full text-black"
              onClick={goToNextMonth}
              aria-label="Next month"
            >
              <ChevronRightRoundedIcon sx={{ fontSize: 22 }} />
            </Button>
          </div>
        </div>
      </div>

      <Carousel
        setApi={setCarouselApi}
        opts={{ align: "start", containScroll: "trimSnaps" }}
        className="w-full"
      >
        <div
          className="min-w-0"
          style={{
            WebkitMaskImage: `linear-gradient(to right, ${
              canScrollPrev ? "transparent 0%, black 2.5rem" : "black 0%"
            }, ${
              canScrollNext
                ? "black calc(100% - 2.5rem), transparent 100%"
                : "black 100%"
            })`,
            maskImage: `linear-gradient(to right, ${
              canScrollPrev ? "transparent 0%, black 2.5rem" : "black 0%"
            }, ${
              canScrollNext
                ? "black calc(100% - 2.5rem), transparent 100%"
                : "black 100%"
            })`,
          }}
        >
        <CarouselContent className="-ml-4 items-center p-3 min-h-[320px]">
            {visibleNotes.map((note) => (
              <CarouselItem
                key={note.noteId}
                className="basis-[300px] pl-4 md:basis-[320px]"
              >
                <NoteCard note={note} onClick={() => openEdit(note)} />
              </CarouselItem>
            ))}

            <CarouselItem className="basis-[140px] self-center items-center pl-4">
              <button
                type="button"
                onClick={openCreate}
                className="flex h-[108px] w-[107px] flex-col items-center justify-center
                gap-1 rounded-[40px] border-2 border-dashed border-black
                text-black transition hover:-translate-y-1 hover:cursor-pointer"
              >
                <ModeEditRoundedIcon sx={{ fontSize: 28 }} />
                <span className="font-inter text-sm font-medium">New Note</span>
              </button>
            </CarouselItem>
        </CarouselContent>
        </div>
      </Carousel>
    </motion.div>
  );
}
