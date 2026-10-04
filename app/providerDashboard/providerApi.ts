"use server"

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "../lib/supabase/server";
import { data } from "framer-motion/client";

function getAdminClient() {
    const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SECRETKEY;
    if (!url || !key) {
        throw new Error("Missing SUPABASE_URL or SUPABASE_SECRETKEY");
    }
    return createAdminClient(url, key);
}

export async function requestThisWeeksNotes(){
    const supabase = await createClient();
    const { data :{ user}} = await supabase.auth.getUser();
    if(!user){
        return {error : "User does not exist", notes : [] as const}
    }

    //request notes
    const admin = getAdminClient();
    const { data: roleRow, error: roleError } = await admin
    .from("Users")
    .select("role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

    if(roleError){
        return {error : "Error verifying admin", notes : [] as const}
    }

    if(roleRow?.role !== "admin"){
        return {error : "User is not admin", notes : [] as const}
    }
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoIso = weekAgo.toISOString();
    const {data} = await admin.from("Notes")
    .select("id, title, description, color, created_at, user_id")
    .gte("created_at", weekAgoIso).order("created_at", {ascending : false});
    

    const notes = data ?? [];
    const userIds = [...new Set(notes.map((note) => note.user_id).filter(Boolean))];

    let nameByUserId = new Map<string, string>();
    if (userIds.length > 0) {
        const { data: users, error: usersError } = await admin
            .from("Users")
            .select("auth_user_id, first_name, last_name")
            .in("auth_user_id", userIds);

        if (usersError) {
            return { error: usersError.message, notes: [] as const };
        }

        nameByUserId = new Map(
            (users ?? []).map((row) => [
                row.auth_user_id as string,
                `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
            ]),
        );

    return {
        notes : notes.map((note) => ({...note, 
            authorName : nameByUserId.get(note.user_id) || undefined,
         })),
    };
        
    } 
}

export async function requestAllNotes() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not signed in", notes: [] as const };
    }

    const admin = getAdminClient();
    const { data: roleRow, error: roleError } = await admin
        .from("Users")
        .select("role")
        .eq("auth_user_id", user.id)
        .maybeSingle();

    if (roleError) {
        return { error: roleError.message, notes: [] as const };
    }
    if (roleRow?.role !== "admin") {
        return { error: "Forbidden", notes: [] as const };
    }

    const { data, error } = await admin
        .from("Notes")
        .select("id, title, description, color, created_at, user_id")
        .order("created_at", { ascending: false });

    if (error) {
        return { error: error.message, notes: [] as const };
    }

    const notes = data ?? [];
    const userIds = [...new Set(notes.map((note) => note.user_id).filter(Boolean))];

    let nameByUserId = new Map<string, string>();
    if (userIds.length > 0) {
        const { data: users, error: usersError } = await admin
            .from("Users")
            .select("auth_user_id, first_name, last_name")
            .in("auth_user_id", userIds);

        if (usersError) {
            return { error: usersError.message, notes: [] as const };
        }

        nameByUserId = new Map(
            (users ?? []).map((row) => [
                row.auth_user_id as string,
                `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
            ]),
        );
    }

    return {
        notes: notes.map((note) => ({
            ...note,
            authorName: nameByUserId.get(note.user_id) || undefined,
        })),
    };
}
