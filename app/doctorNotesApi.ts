"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "./lib/supabase/server";
import type { userNote } from "./types";
import { mapDoctorNote } from "./util";

function getAdminClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRETKEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SECRETKEY");
  }
  return createAdminClient(url, key);
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not signed in" as const };
  }

  const admin = getAdminClient();
  const { data: roleRow, error: roleError } = await admin
    .from("Users")
    .select("role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (roleError) {
    return { error: roleError.message};
  }
  if (roleRow?.role !== "admin") {
    return { error: "Forbidden" as const };
  }

  return { admin, user };
}

export async function getDoctorNoteForClientNote(clientNoteId: number | string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not signed in", note: null as userNote | null };
  }

  const admin = getAdminClient();
  const { data: roleRow } = await admin
    .from("Users")
    .select("role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const client = roleRow?.role === "admin" ? admin : supabase;

  const { data, error } = await client
    .from("DoctorNotes")
    .select("id, title, description, color, created_at, author_id, client_note_id")
    .eq("client_note_id", clientNoteId)
    .maybeSingle();

  if (error) {
    return { error: error.message, note: null as userNote | null };
  }

  if (!data) {
    return { note: null as userNote | null };
  }

  let authorName: string | undefined;
  if (data.author_id) {
    const { data: author } = await admin
      .from("Users")
      .select("first_name, last_name")
      .eq("auth_user_id", data.author_id)
      .maybeSingle();
    authorName = author
      ? `${author.first_name ?? ""} ${author.last_name ?? ""}`.trim()
      : undefined;
  }

  return {
    note: mapDoctorNote({ ...data, author_name: authorName, client_note_id: data.client_note_id }),
  };
}

export async function getDoctorNotesForPatient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not signed in", notes: [] as userNote[] };
  }

  const { data, error } = await supabase
    .from("DoctorNotes")
    .select("id, title, description, color, created_at, author_id, client_note_id")
    .eq("patient_user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message, notes: [] as userNote[] };
  }

  const notes = data ?? [];
  const authorIds = [...new Set(notes.map((note) => note.author_id).filter(Boolean))];

  let nameByAuthorId = new Map<string, string>();
  if (authorIds.length > 0) {
    const admin = getAdminClient();
    const { data: authors } = await admin
      .from("Users")
      .select("auth_user_id, first_name, last_name")
      .in("auth_user_id", authorIds);

    nameByAuthorId = new Map(
      (authors ?? []).map((author) => [
        author.auth_user_id as string,
        `${author.first_name ?? ""} ${author.last_name ?? ""}`.trim(),
      ]),
    );
  }

  return {
    notes: notes.map((note) =>
      mapDoctorNote({
        ...note,
        author_name: nameByAuthorId.get(note.author_id),
        client_note_id: note.client_note_id,
      }),
    ),
  };
}

export async function saveDoctorNote(input: {
  clientNoteId: number | string;
  patientUserId: string;
  title: string;
  description: string;
  color: string;
  noteId?: number | string;
}) {
  const auth = await requireAdmin();
  if ("error" in auth && auth.error) {
    return { error: auth.error };
  }

  const { admin, user } = auth as { admin: ReturnType<typeof getAdminClient>; user: { id: string } };

  if (input.noteId != null) {
    const { error } = await admin
      .from("DoctorNotes")
      .update({
        title: input.title,
        description: input.description,
        color: input.color,
      })
      .eq("id", input.noteId);

    if (error) {
      return { error: error.message };
    }
    return { success: true as const };
  }

  const { error } = await admin.from("DoctorNotes").insert({
    client_note_id: input.clientNoteId,
    patient_user_id: input.patientUserId,
    author_id: user.id,
    title: input.title,
    description: input.description,
    color: input.color,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true as const };
}

export async function searchPatient(patientSearch: string) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return { error: auth.error, notes: [] as const, patient: null };
  }

  const { admin } = auth;
  const trimmedSearch = patientSearch.trim().toLowerCase();
  const timmedSeachParts = trimmedSearch.split(/\s+/)

  if(trimmedSearch.includes("@")) {
    const { data, error } = await admin
    .from("Users")
    .select("auth_user_id, first_name, last_name, email,current_weight, current_age")
    .eq("email", trimmedSearch)
    .maybeSingle();
      
    if (error) {
      return { error: error.message, notes: [] as const, patient: null };
    }

    if (!data) {
      return { error: "No Patient Found", notes: [] as const, patient: null };
    }

    const { data: patientNotes, error: patientError } = await admin
    .from("Notes")
    .select("id, title, description, color, created_at, user_id")
    .eq("user_id", data.auth_user_id)
    .order("created_at", { ascending: false });

  if (patientError) {
    return {
      error: "Problem retrieving patient notes, Please try again with a different search term",
      notes: [] as const,
      patient: null,
    };
  }

  const name = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim();

  return {
    patient: {
      authUserId: data.auth_user_id as string,
      name: name || trimmedSearch,
      email: (data.email as string) ?? trimmedSearch,
      currentAge: data.current_age,
      currentWeight: data.current_weight
    },
    notes: patientNotes ?? [],
  };

  } else {
    const { data, error } = await admin
    .from("Users")
    .select("auth_user_id, first_name, last_name, email,current_weight, current_age")
    .ilike("first_name", `%${timmedSeachParts[0]}%`)
    .ilike("last_name", `%${timmedSeachParts[timmedSeachParts.length - 1]}%`)
    .maybeSingle();


    if (error) {
      return { error: "Problem retrieving patient, Please try again with a different search term", notes: [] as const, patient: null };
    }

    if (!data) {
      return { error: "No Patient Found, Please try again with a different search term", notes: [] as const, patient: null };
    }

    const { data: patientNotes, error: patientError } = await admin
    .from("Notes")
    .select("id, title, description, color, created_at, user_id")
    .eq("user_id", data.auth_user_id)
    .order("created_at", { ascending: false });

  if (patientError) {
    return {
      error: "Problem retrieving patient notes",
      notes: [] as const,
      patient: null,
    };
  }

  const name = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim();

  return {
    patient: {
      authUserId: data.auth_user_id as string,
      name: name || trimmedSearch,
      email: (data.email as string) ?? trimmedSearch,
      currentAge: data.current_age,
      currentWeight: data.current_weight
    },
    notes: patientNotes ?? [],
  };
  }



}



