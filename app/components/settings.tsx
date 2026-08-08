"use client"

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut } from "../clientDashboard/profileChange";
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import {motion, AnimatePresence} from "framer-motion";
import LogOutIcon from "../../public/icons/Log out.svg"
import Image from "next/image";


export default function settingsMenu(){
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);

    async function handleSignOut(){
        await signOut();
        setIsOpen(false);
        router.push('/signIn');
    }

    useEffect(() => {
        if(!isOpen) return;
        
        function handlePointerDown(event: MouseEvent){
            const target = event.target as Node;
            if(menuRef.current && !menuRef.current.contains(target)){
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handlePointerDown);
        return() => document.removeEventListener("mousedown", handlePointerDown);


    },[isOpen]);

    return(
        <div ref={menuRef}>
            <div className=" text-black bg-white rounded-full p-2  duration-300 
            hover:cursor-pointer hover:-translate-y-1"
            onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen)}}>
                <SettingsRoundedIcon sx={{color: "currentColor", fontSize:35}}/>
            </div>
            <AnimatePresence>
            {isOpen && (
                
                    <motion.div className="absolute left-20 ml-2 min-w-[140px] rounded-xl
                bg-white p-2 shadow-lg border border-gray-200 z-50"
                    key="settings-menu"
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, x: 8 }}
                    exit={{opacity: 0, x: 0}}
                    transition={{ duration: .2, ease: 'easeOut'}}>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="w-full gap-2 inline-flex items-center rounded-lg p-4 
                            py-2 text-left text-sm text-black hover:bg-gray-100 hover: cursor-pointer"
                        >
                            <Image
                            src={typeof LogOutIcon === "string" ? LogOutIcon : LogOutIcon.src}
                            alt="Log Out"
                            width={'24'}
                            height={'24'}/>
                            Sign out
                        </button>
                    </motion.div>
                
            )} 
            </AnimatePresence>
        </div>

    );
}