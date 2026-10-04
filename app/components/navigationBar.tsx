"use client"

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import MedicalInformationRoundedIcon from '@mui/icons-material/MedicalInformationRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Image from "next/image";
import { useState } from 'react';
import type {NavItem} from '../types';
import SettingsMenu from './settings';


type Props = {
    active: NavItem;
    onChange: (id: NavItem) => void;
    navIcons: {id: NavItem, label: string, Icon?: typeof EditNoteRoundedIcon}[];
};


export default function navigationBar({active, onChange, navIcons}: Props){
    const [pageState, setPageState] = useState<NavItem>(active);
    
    return(
        <nav className="flex flex-col bg-[#EDF1EC] w-20  my-5 px-3 rounded-lg">
            {/* logo element */}

            {/* home, Doctors notes and my notes */}
            <div className="flex flex-col gap-6 items-center justify-center mt-5">
                {navIcons.map(({id,label,Icon}) => {
                    const activeBttn = pageState === id;

                    return (
                        <button key={id} onClick={() => {setPageState(id);
                        onChange(id);}}
                        className={activeBttn? 
                        "bg-black text-white rounded-full p-2 hover:cursor-pointer duration-300 hover:-translate-y-1"
                        :"text-black bg-white rounded-full p-2  duration-300 hover:cursor-pointer hover:-translate-y-1"}>
                            {Icon && <Icon sx={{color: "currentColor", fontSize:35}}/>}    
                        </button>
                    );
                    })} 

            </div>    

            {/* Setting, and profile picture */} 
            <div className="flex flex-col items-center mt-auto mb-5 gap-6">
                <SettingsMenu/>
                <div className=" text-black bg-white rounded-full p-2  duration-300 
                ">
                    <PersonRoundedIcon sx={{color: "currentColor", fontSize:35}}/>
                </div>                   
            </div>
        </nav>
    );
}