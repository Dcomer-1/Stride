"use server"
import { NextRequest} from "next/server";
import {createClient} from '../lib/supabase/server';



export async function updateGoal(userGoal: string){
    const supabase = await createClient();
    const {data: {user} } = await supabase.auth.getUser();
    const {error : updateError} = await supabase.from("Users")
    .update({goal : userGoal})
    .eq('auth_user_id', user?.id)

    if(updateError){
        return Error(updateError.message)
    }
    
}

export async function clearGoal(){
    const supabase = await createClient();
    const {data: {user} } = await supabase.auth.getUser();
    const {error : updateError} = await supabase.from("Users")
    .update({goal : ''})
    .eq('auth_user_id', user?.id)

    if(updateError){
        return Error(updateError.message)
    }
    
}

export async function updateMood(userMood: string){
    const supabase = await createClient();
    const {data: {user} } = await supabase.auth.getUser();
    const {error : updateError} = await supabase.from("Users")
    .update({mood : userMood})
    .eq('auth_user_id', user?.id)

    if(updateError){
        return Error(updateError.message)
    }
}

export async function createNote(noteTitle: string, noteDescription: string, noteColor: string){
    const supabase = await createClient();
    const {data: {user} } = await supabase.auth.getUser();
    const {error : updateError} = await supabase.from("Notes")
    .insert({title : noteTitle, description : noteDescription,
        color: noteColor, user_id: user?.id})


    if(updateError){
        return Error(updateError.message)    
    }

    return {success : true}

}

export async function showAllNotes(){
    const supabase = await createClient();
    const {data: {user} } = await supabase.auth.getUser();

    if(!user){
        return { error: "Not signed in", notes: [] as const };
    }

    const { data, error } = await supabase.from("Notes")
    .select("id, title, description, color, created_at")
    .eq('user_id', user.id)
    .order("created_at", { ascending: false });
    
    if(error){
        return { error: error.message, notes: [] as const };    
    }

    return { notes: data ?? [] };    
}



export async function updateNote(noteTitle: string, noteDescription: string, noteColor: string, noteId: number | string){
    const supabase = await createClient();
    const {data: {user} } = await supabase.auth.getUser();
    const {error : updateError} = await supabase.from("Notes")
    .update({title : noteTitle, description : noteDescription,
        color: noteColor})
    .eq('user_id',user?.id)
    .eq("id", noteId)
    
    if(updateError){
        return Error(updateError.message)    
    }

    return {success : true}

}

