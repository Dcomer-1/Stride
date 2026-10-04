"use client"
import { useEffect, useState } from "react";
import NavigationBar from "../components/navigationBar";
import UserProfile from "../components/userProfile";
import type {userProfile} from '../types';
import type {NavItem} from '../types';
import Journal from "./states/journal";
import Home from "./states/home";
import DoctorsNotePage from "./states/doctorsNotes";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import MedicalInformationRoundedIcon from '@mui/icons-material/MedicalInformationRounded';


export default function ClientDashboardShell({profile} : {profile : userProfile}){

    const [tab, setTab] = useState<NavItem>('home');
    const navIcons: {id: NavItem, label: string, Icon?: typeof EditNoteRoundedIcon}[] =[
        {id: 'home', label: 'Home', Icon: HomeRoundedIcon },
        {id: 'doctors notes', label: "Doctor's Notes", Icon: MedicalInformationRoundedIcon },
        {id: 'journal', label: 'Journal', Icon: EditNoteRoundedIcon},
        // {id: 'settings', label: 'Settings', Icon: SettingsRoundedIcon},
        
    ]

    return(
    <div className="h-screen overflow-y-hidden w-screen bg-white overflow-x-hidden flex px-5">
        <NavigationBar active={tab} onChange={setTab} navIcons={navIcons} />
        {tab === 'journal' && <Journal/>}
        {tab === 'home' && <Home/>}
        {tab === 'doctors notes' && <DoctorsNotePage/>}
        <UserProfile profile={profile}/>
    </div>
    );
}