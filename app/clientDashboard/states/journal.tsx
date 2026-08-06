
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { useState } from 'react';
import { NoteModal } from '../noteModal';


export default function Journal(){
    const [isOpen, setIsOpen] = useState(false);
    
    

    return(
        <div className="w-full flex flex-1 flex-col m-5 md:my-10 p-5 
        rounded-2xl ">
            {isOpen && <NoteModal onClose={()=>{setIsOpen(false)}} onSave={()=>{}} />} 
            {/* Top part | Section Title, Add Note and Filter */}

            <div className="flex w-full gap-5 font-inter ">
                <button onClick={() => {setIsOpen(true)}} className=" text-black text-sm 
                hover:cursor-pointer ">
                    <AddCircleOutlineRoundedIcon sx={{color : "black", fontSize : 35, animationDuration: 200,
                    transition: "font-size 100ms ease",
                    "&:hover" : {
                        fontSize: 40
                    }
                    }}/>    
                </button>
                <h2 className="text-black text-7xl font-serif font-medium leading-none">
                    All Notes
                </h2>
                <h2 className="ml-auto text-black text-2xl self-end leading-none">
                    Filter
                </h2>
            </div>
            <div className="mt-3 bg-black h-1 w-3/4 rounded-full"/>
            {/* Display notes (All by default) */}
        </div>
    );
}