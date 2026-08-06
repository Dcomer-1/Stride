import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export type userMood = "unhappy" | "somewhat_unhappy" | "neutral" | "somewhat_happy" | "happy";

export type NavItem =  'home' | 'doctors notes' | 'journal' | 'settings';

export interface userProfile{
    first_name: string,
    last_name: string,
    current_weight: number,
    current_age: number,
    email: string,
    mood: userMood,
    authorized_email_id: string,
    goal: string,
}

export type userNote = {
    title : string,
    description : string,
    color: string,
}