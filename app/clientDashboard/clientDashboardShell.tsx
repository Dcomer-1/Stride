"use client"
import { useEffect, useState } from "react";
import NavigationBar from "../components/navigationBar";
import UserProfile, { MobileProfilePopup } from "../components/userProfile";
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
    const [profileOpen, setProfileOpen] = useState(false);
    const navIcons: {id: NavItem, label: string, Icon?: typeof EditNoteRoundedIcon}[] =[
        {id: 'home', label: 'Home', Icon: HomeRoundedIcon },
        {id: 'doctors notes', label: "Doctor's Notes", Icon: MedicalInformationRoundedIcon },
        {id: 'journal', label: 'Journal', Icon: EditNoteRoundedIcon},
        // {id: 'settings', label: 'Settings', Icon: SettingsRoundedIcon},
        
    ]

    return(
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-white md:flex-row md:px-5">
        <NavigationBar
            active={tab}
            onChange={setTab}
            navIcons={navIcons}
            onProfileClick={() => setProfileOpen(true)}
        />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex-row">
            {tab === 'journal' && <Journal/>}
            {tab === 'home' && <Home/>}
            {tab === 'doctors notes' && <DoctorsNotePage/>}
            <div className="hidden min-h-0 md:my-5 md:flex md:h-auto md:flex-col md:self-stretch">
                <UserProfile profile={profile}/>
            </div>
        </div>
        <MobileProfilePopup
            profile={profile}
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
        />
    </div>
    );
}