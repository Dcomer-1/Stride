"use client"

import { useState } from "react";
import saveIcon from "../../public/icons/Save.svg";
import deleteIcon from "../../public/icons/delete.svg"; 
import closeIcon from "../../public/icons/close.svg";
import { userNote, NoteColor } from "../types";
import { formatNoteDate } from "../util";

type Props = {
    onClose : () => void;
    onSave : (note: {title : string , description : string, color : string, noteId? : number | string}) => void;
    initialNote? : userNote;
    readOnlyView : boolean;
    date? : string | Date;
    name? : string;
}

const AUTHOR_COLORS: Record<NoteColor, string> = {
    red: "#9D3333",
    yellow: "#9D8133",
    green: "#4C9D33",
    purple: "#43339D",
  };


const COLORS: {id: NoteColor, color: string}[] = [
    {id : 'red' , color : '#F29191'},
    {id: 'yellow', color : '#F2D891'},
    {id : 'green', color : '#A8F291'},
    {id : 'purple', color : '#9196F2'}
] as const



export function NoteModal({onClose, onSave, initialNote ={title: "" , description: "", color: "red"}, 
    readOnlyView = false, date, name} : Props){
    const [title, setTitle] = useState(initialNote.title);
    const [description, setDescription] = useState(initialNote.description);
    const [color, setColor] = useState<NoteColor>(initialNote.color);
    const noteId = initialNote.noteId;
    const activeColor = COLORS.find((c) => c.id === color)?.color ?? COLORS[0].color;
    const authorColor = AUTHOR_COLORS[color] ?? AUTHOR_COLORS.red


    return(
        // dim background
        <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={onClose}>


            <div className={`p-4 pt-15 flex flex-col max-w-2xl w-full rounded-4xl max-h-[90vh]`}
            style={{background : activeColor}}
            onClick={(e) => e.stopPropagation()}>
                <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-lg 
                text-black font-inter duration-200 flex flex-col rounded-t-4xl "
                >
                {/* close button */}
                    {/* <h3 className="text-5xl font-serif">New Note</h3> */}
                    {!readOnlyView && (
                        <div className="flex gap-2 mt-1">
                            {COLORS.map(({id, color}) => (
                                <button
                                key={id} 
                                className="w-4 h-4 rounded-full hover:cursor-pointer"
                                style={{background : color}}
                                onClick={() => setColor(id) }
                                >
                                </button>

                            ))}
                        </div>                        
                    )}

                    <img
                        src={typeof saveIcon === "string"? closeIcon : closeIcon.src }
                        className="size-8 hover:cursor-pointer mb-2 self-end 
                        hover:size-10 duration-200"
                        onClick={onClose}
                    />

                    {readOnlyView ? (
                        <div>
                            <h3 className="text-5xl mb-3"> {title} </h3>
                            <h4 className="font-serif text-2xl my-2"> {formatNoteDate(date)} </h4>
                        </div>

                    ) : (
                        <input
                        value={title}
                        onChange={(e)=> {setTitle(e.currentTarget.value)}}
                        placeholder="Title (i.e. What I Ate Today)"
                        className="mb-3 w-full border-2 border-gray-300 p-2 rounded-xl
                        resize-none focus:outline-none"/> 
                    )}



                    {readOnlyView ? (
                        <p className=" mt-3 text-3xl"> {description} </p>

                    ) : (
                        <textarea
                        value={description}
                        onChange={(e) => {setDescription(e.currentTarget.value)}}
                        placeholder="What Did You Eat Today?"
                        rows={20}
                        className="w-full border-2 p-2 rounded-xl border-gray-300
                        resize-none focus:outline-none">
                        </textarea>
                    )}                     


                    {!readOnlyView && (
                        <div className="mt-3 items-right gap-1 text-sm justify-end font-inter font-medium flex">
                            <button className="bg-[#D93737] p-1 rounded-md mr-1 
                                text-white hover:cursor-pointer inline-flex items-center 
                                justify-center gap-1 hover:p-2 duration-200 shadow-sm">
                                    <img
                                    src={typeof deleteIcon === "string"? deleteIcon : deleteIcon.src }
                                    alt="save icon"
                                    className="size-4"
                                    />
                                Delete
                            </button>
                            <button className="bg-[#45733F] p-1 rounded-md 
                                text-white hover:cursor-pointer inline-flex items-center 
                                justify-center gap-1 hover:bg-[#3A6235] hover:p-2 duration-200"
                                onClick={() => {
                                    if(initialNote.noteId){
                                        onSave({title, description, color, noteId})}
                                    else{
                                        onSave({title, description, color})
                                    }
                                    onClose();
                                    }}>
                                    <img
                                    src={typeof saveIcon === "string"? saveIcon : saveIcon.src }
                                    alt="save icon"
                                    className="size-4"
                                    />
                                Save
                            </button>
                        </div>
                )}
                </div>        
                <p
                className="mt-3 h-6 shrink-0 self-end pr-2 font-inter text-base font-medium"
                style={{ color: authorColor }}
                >
                Name: {name}
                </p>

            </div>
        </div>
    );
}