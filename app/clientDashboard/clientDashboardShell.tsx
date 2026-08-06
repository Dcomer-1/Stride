"use client"
import { useEffect, useState } from "react";
import NavigationBar from "./navigationBar";
import UserProfile from "./userProfile";
import type {userProfile} from '../types';
import type {NavItem} from '../types';
import Journal from "./states/journal";


export default function ClientDashboardShell({profile} : {profile : userProfile}){

    const [tab, setTab] = useState<NavItem>('home');

    return(
    <div className="h-full w-screen bg-white overflow-x-hidden flex px-5">
        <NavigationBar active={tab} onChange={setTab} />
        {tab === 'journal' && <Journal/>}
        <UserProfile profile={profile}/>
    </div>
    );
}