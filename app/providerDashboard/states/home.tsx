"use client"

import { userNote, NoteColor } from "@/app/types";
import { useEffect, useState } from "react";
import { requestAllNotes } from "../providerApi";
import Image from "next/image";
import searchIcon from "../../../public/icons/Icon.svg"
import NoteCard from "../../components/noteCard";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { NoteModal } from "@/app/components/noteModal";

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
    authorName?: string;
  }): userNote {
    return {
      noteId: row.id,
      title: row.title,
      description: row.description,
      color: toNoteColor(row.color),
      date: row.created_at,
      authorName: row.authorName,
    };
  }


export default function ProviderHome(){

    const [userNotes, setUserNotes] = useState<userNote[]>([]);
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [viewingNote, setViewingNote] = useState<userNote | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    async function loadAllNotes(){
        const result = await requestAllNotes();
        if (result.error) {
            console.error("requestAllNotes:", result.error);
            setUserNotes([]);
            return;
        }
        setUserNotes(result.notes.map(mapDbNote));
    }

    function handleNoteView(){
        setIsOpen(!isOpen);

    }

    function handleViewingNote(note : userNote){
        setViewingNote(note);
        setIsOpen(true);
    }

    useEffect(() => {
        loadAllNotes();
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
                <div className="flex min-w-0 flex-col gap-3">
                    <h2 className="font-serif text-4xl font-light text-black md:text-6xl lg:text-[96px]">
                    Search For A Patient
                    </h2>
                    <span className="inset-x-0 -bottom-0.5 h-[4px] w-full rounded-full bg-black" />
                </div>
                <form className="flex w-full max-w-md max-h-1/2 items-center gap-2 
                rounded-2xl border-2 p-3 md:w-auto shadow-md
                ">
                    <input
                    className="min-w-0 flex-1 rounded-2xl outline-none "
                    placeholder="Enter Patient Email"
                    />
                        <Image
                        className="shrink-0
                        hover: cursor-pointer"
                        width={20}
                        height={20}
                        src={
                            typeof searchIcon === "string" ? searchIcon : searchIcon.src
                        }
                        alt="search icon"
                        />
                </form>
            </div>

            {isOpen && (
                <NoteModal
                    onClose={() => {
                        setIsOpen(false);
                        setViewingNote(null);
                    }}
                    initialNote={viewingNote ?? undefined}
                    onSave={()=>{}}
                    readOnlyView={true}
                    date={viewingNote?.date}
                    name={viewingNote?.authorName}
                
                />
            )}

            <div className="mt-4 flex w-full flex-col gap-4">
                <div className="flex items-end justify-between gap-4">
                    <h3 className="font-serif text-[40px] text-black">
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

                    <CarouselPrevious className="-left-3 border-black bg-white text-black hover:bg-gray-100" />
                    <CarouselNext className="-right-3 border-black bg-white text-black hover:bg-gray-100" />
                </Carousel>
            </div>
            
        </div>

    );
}
