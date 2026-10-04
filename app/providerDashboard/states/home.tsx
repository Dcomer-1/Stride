"use client"

import { userNote, NoteColor } from "@/app/types";
import { useEffect, useState } from "react";
import { requestAllNotes, requestThisWeeksNotes } from "../providerApi";
import Image from "next/image";
import searchIcon from "../../../public/icons/Icon.svg"
import NoteCard from "../../components/noteCard";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { SplitNoteModal } from "@/app/components/splitNoteModal";
import { PatientNotesModal } from "@/app/components/patientNotesModal";
import AllowListForm from "@/app/components/allowListForm";
import {
  getDoctorNoteForClientNote,
  saveDoctorNote,
  searchPatient,
} from "@/app/doctorNotesApi";

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
    user_id?: string;
    authorName?: string;
  }): userNote {
    return {
      noteId: row.id,
      title: row.title,
      description: row.description,
      color: toNoteColor(row.color),
      date: row.created_at,
      authorName: row.authorName,
      patientUserId: row.user_id,
    };
  }


export default function ProviderHome(){

    const [userNotes, setUserNotes] = useState<userNote[]>([]);
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [viewingNote, setViewingNote] = useState<userNote | null>(null);
    const [doctorNote, setDoctorNote] = useState<userNote | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [patientSearch, setPatientSearch] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<{
        name: string;
        email: string;
        authUserId: string;
    } | null>(null);
    const [selectedPatientNotes, setSelectedPatientNotes] = useState<userNote[]>([]);
    const [patientLookupOpen, setPatientLookupOpen] = useState(false);
    const [lookupError, setLookupError] = useState<string | null>(null);

    async function loadAllNotes(){
        const result = await requestAllNotes();
        if (result.error) {
            console.error("requestAllNotes:", result.error);
            setUserNotes([]);
            return;
        }
        setUserNotes(result.notes.map(mapDbNote));
    }

    async function loadThisWeeksNotes(){
        const result = await requestThisWeeksNotes();
        if(result?.error){
            console.error("Error Loading This Weeks Notes", result.error)
            setUserNotes([]);
            return;
        }
        setUserNotes(result?.notes.map(mapDbNote) ?? []);;
    }

    async function handleViewingNote(note: userNote) {
        setViewingNote(note);
        setDoctorNote(null);

        if (note.noteId != null) {
            const result = await getDoctorNoteForClientNote(note.noteId);
            if (result.note) {
                setDoctorNote(result.note);
            }
        }

        setIsOpen(true);
    }

    async function handleSaveDoctorNote(note: {
        title: string;
        description: string;
        color: string;
        noteId?: number | string;
    }) {
        if (!viewingNote?.noteId || !viewingNote.patientUserId) return;

        const result = await saveDoctorNote({
            clientNoteId: viewingNote.noteId,
            patientUserId: viewingNote.patientUserId,
            title: note.title,
            description: note.description,
            color: note.color,
            noteId: note.noteId ?? doctorNote?.noteId,
        });

        if (result.error) {
            console.error("saveDoctorNote:", result.error);
            return;
        }

        const refreshed = await getDoctorNoteForClientNote(viewingNote.noteId);
        if (refreshed.note) {
            setDoctorNote(refreshed.note);
        }
    }

    async function handlePatientLookup(patientSearch: string) {
        setLookupError(null);
        const result = await searchPatient(patientSearch);

        if (result.error || !result.patient) {
            console.error(result.error);
            setSelectedPatient(null);
            setSelectedPatientNotes([]);
            setLookupError(result.error ?? "No Patient Found");
            setPatientLookupOpen(false);
            return;
        }

        const patientName = result.patient.name;
        setSelectedPatient(result.patient);
        setSelectedPatientNotes(
            result.notes.map((row) =>
                mapDbNote({
                    ...row,
                    authorName: patientName,
                }),
            ),
        );
        setPatientLookupOpen(true);
    }

    useEffect(() => {
        loadThisWeeksNotes();
    }, []);

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
    }, [carouselApi, userNotes.length]);

    return(
        
        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-hidden py-5 pl-4">
            <div className="flex max-h-[500px] min-h-0 flex-1 flex-col gap-3">
                <h3 className="w-fit shrink-0 border-b-4 border-black pb-1 font-serif text-3xl text-black">
                    This Week&apos;s Entries
                </h3>

                <Carousel
                    setApi={setCarouselApi}
                    opts={{ align: "start", containScroll: "trimSnaps" }}
                    className="flex min-h-0 w-full flex-1 flex-col"
                >
                    <div
                        className="h-full min-h-0 min-w-0 flex-1"
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
                    <CarouselContent className="-ml-4 h-full items-stretch p-3">
                        {userNotes.map((note) => (
                            <CarouselItem
                                key={note.noteId}
                                className="h-full min-h-0 basis-[280px] pl-4"
                            >
                                <NoteCard fill note={note} onClick={() => handleViewingNote(note) } />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    </div>
                </Carousel>
            </div>

            <div className="grid w-full shrink-0 grid-cols-1 items-start gap-4 lg:grid-cols-2">
                <section className="flex min-w-0 flex-col gap-3 rounded-2xl">
                    <h2 className="w-fit border-b-4 border-black  font-serif text-3xl text-black">
                        Search For A Patient
                    </h2>
                    <form
                        className="flex w-full items-center gap-2 rounded-2xl border-2 p-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handlePatientLookup(patientSearch);
                        }}
                    >
                        <input
                            className="min-w-0 flex-1 bg-transparent font-inter outline-none"
                            placeholder="Enter Patient Email Or Name"
                            value={patientSearch}
                            onChange={(e) => {
                                setPatientSearch(e.target.value);
                            }}
                        />
                        <button type="submit" className="shrink-0 hover:cursor-pointer">
                            <Image
                                width={20}
                                height={20}
                                src={
                                    typeof searchIcon === "string"
                                        ? searchIcon
                                        : searchIcon.src
                                }
                                alt="search icon"
                            />
                        </button>
                    </form>
                    {lookupError && (
                        <p className="font-inter text-base text-[#D93737]">{lookupError}</p>
                    )}
                <AllowListForm />
                </section>
                {/* Add Notification Section On the right side of the page */}
            
            </div>

            {patientLookupOpen && selectedPatient && (
                <PatientNotesModal
                    patientName={selectedPatient.name}
                    patientEmail={selectedPatient.email}
                    notes={selectedPatientNotes}
                    onClose={() => {
                        setPatientLookupOpen(false);
                    }}
                    onSelectNote={handleViewingNote}
                />
            )}

            {isOpen && viewingNote && (
                <SplitNoteModal
                    onClose={() => {
                        setIsOpen(false);
                        setViewingNote(null);
                        setDoctorNote(null);
                    }}
                    clientNote={viewingNote}
                    doctorNote={doctorNote}
                    clientReadOnly
                    doctorReadOnly={false}
                    onSaveDoctor={handleSaveDoctorNote}
                    clientName={viewingNote.authorName}
                />
            )}

        </div>

    );
}
