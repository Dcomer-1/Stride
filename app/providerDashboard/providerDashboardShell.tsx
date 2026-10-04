"use client"
import { useEffect, useState } from "react";
import NavigationBar from "../components/navigationBar";
import UserProfile from "../components/userProfile";
import type {userProfile} from '../types';
import type {NavItem} from '../types';
import ProviderHome from "./states/home";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import MedicalInformationRoundedIcon from '@mui/icons-material/MedicalInformationRounded';



export default function ProviderDashboardShell({profile} : {profile : userProfile}){

    const [tab, setTab] = useState<NavItem>('home');
    const navIcons: {id: NavItem, label: string, Icon?: typeof EditNoteRoundedIcon}[] =[
        {id: 'home', label: 'Home', Icon: HomeRoundedIcon },
        // {id: 'doctors notes', label: "Doctor's Notes", Icon: MedicalInformationRoundedIcon },
        // {id: 'journal', label: 'Journal', Icon: EditNoteRoundedIcon},
        // {id: 'settings', label: 'Settings', Icon: SettingsRoundedIcon},
        
    ]

    return(
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-white px-5">
        <NavigationBar active={tab} onChange={setTab} navIcons={navIcons} />
        {tab === 'home' && <ProviderHome/>}
    </div>
    );
}