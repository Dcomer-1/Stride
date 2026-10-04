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
    const [patientEmail, setPatientEmail] = useState("");
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

    async function handlePatientLookup(email: string) {
        setLookupError(null);
        const result = await searchPatient(email);

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
        
        <div className="flex flex-col w-full m-10">
            <div className="flex w-full flex-col gap-6 md:flex-row md:items-start mb-5 md:justify-between">
                <div className="flex min-w-0 flex-col gap-3 mb-10">
                    <h2 className="font-serif text-4xl font-light text-black md:text-6xl lg:text-[96px]">
                    Search For A Patient
                    </h2>
                    <span className="inset-x-0 -bottom-0.5 h-[4px] w-full rounded-full bg-black" />
                </div>
                <form
                    className="flex w-full max-w-md max-h-1/2 items-center gap-2 
                rounded-2xl border-2 p-3 md:w-auto shadow-md
                "
                    onSubmit={(e) => {
                        e.preventDefault();
                        handlePatientLookup(patientEmail);
                    }}
                >
                    <input
                        className="min-w-0 flex-1 rounded-2xl outline-none "
                        placeholder="Enter Patient Email"
                        value={patientEmail}
                        onChange={(e) => {
                            setPatientEmail(e.target.value);
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
            </div>

            {lookupError && (
                <p className="mb-4 font-inter text-base text-[#D93737]">{lookupError}</p>
            )}

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

            <div className="mt-4 flex w-full flex-col gap-4">
                <div className="flex flex-col  justify-between gap-4 ">
                    <h3 className="w-fit border-b-4 border-black pb-1 font-serif text-[40px] text-black">
                        This Week&apos;s Entries
                    </h3>
            
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
                    <CarouselContent className="-ml-4 items-stretch p-3 min-h-[320px]">
                        {userNotes.map((note) => (
                            <CarouselItem
                                key={note.noteId}
                                className="basis-[300px] pl-4 md:basis-[320px]"
                            >
                                <NoteCard note={note} onClick={() => handleViewingNote(note) } />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    </div>
                </Carousel>
            </div>
            
        </div>

    );
}
