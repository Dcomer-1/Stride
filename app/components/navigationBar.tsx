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
    onProfileClick?: () => void;
};


export default function navigationBar({active, onChange, navIcons, onProfileClick}: Props){
    const [pageState, setPageState] = useState<NavItem>(active);
    
    return(
        <nav className="flex w-full shrink-0 flex-row items-center justify-between bg-[#EDF1EC] px-3 py-3 md:my-5 md:w-20 md:flex-col md:items-center md:self-stretch md:rounded-lg md:px-3">
            {/* logo element */}

            {/* home, Doctors notes and my notes */}
            <div className="flex flex-row items-center gap-4 md:mt-5 md:flex-col md:gap-6">
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
            <div className="flex flex-row items-center gap-4 md:mb-5 md:mt-auto md:flex-col md:gap-6">
                <SettingsMenu/>
                <button
                    type="button"
                    onClick={onProfileClick}
                    aria-label="Open profile"
                    className="rounded-full bg-white p-2 text-black duration-300 hover:cursor-pointer md:pointer-events-none"
                >
                    <PersonRoundedIcon sx={{color: "currentColor", fontSize:35}}/>
                </button>                   
            </div>
        </nav>
    );
}