"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "./lib/supabase/server";
import type { NoteColor, userNote } from "./types";

function getAdminClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRETKEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SECRETKEY");
  }
  return createAdminClient(url, key);
}

function toNoteColor(value: string): NoteColor {
  if (
    value === "red" ||
    value === "yellow" ||
    value === "green" ||
    value === "purple"
  ) {
    return value;
  }
  return "green";
}

function mapDoctorNote(row: {
  id: number | string;
  title: string;
  description: string;
  color: string;
  created_at: string;
  author_name?: string;
}): userNote {
  return {
    noteId: row.id,
    title: row.title,
    description: row.description,
    color: toNoteColor(row.color),
    date: row.created_at,
    authorName: row.author_name,
  };
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
    return { error: roleError.message as const };
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
    .select("id, title, description, color, created_at, author_id")
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
    note: mapDoctorNote({ ...data, author_name: authorName }),
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
