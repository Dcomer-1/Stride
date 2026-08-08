"use client"
import { useEffect, useState } from "react";
import NavigationBar from "../components/navigationBar";
import UserProfile from "../components/userProfile";
import type {userProfile} from '../types';
import type {NavItem} from '../types';
import Journal from "./states/journal";
import Home from "./states/home";


export default function ClientDashboardShell({profile} : {profile : userProfile}){

    const [tab, setTab] = useState<NavItem>('home');

    return(
    <div className="h-full w-screen bg-white overflow-x-hidden flex px-5">
        <NavigationBar active={tab} onChange={setTab} />
        {tab === 'journal' && <Journal/>}
        {tab === 'home' && <Home/>}
        <UserProfile profile={profile}/>
    </div>
    );
}