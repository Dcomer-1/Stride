
import { ResponseAbortedName } from "next/dist/server/web/spec-extension/adapters/next-request";
import NavigationBar from "../components/navigationBar";
import UserProfile from "../components/userProfile";
import ProviderDashboardShell from "./providerDashboardShell";
import {createClient} from '../lib/supabase/server';
import { redirect } from "next/navigation";
import { userMood, userProfile } from "../types";



export default async function ClientDashboard() {

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/signIn");
    const { data, error } = await supabase
      .from("Users")
      .select("first_name,last_name,current_weight,current_age,email,mood,authorized_email_id,goal")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    if (error || !data) redirect("/signIn");

    const profile: userProfile = {
      first_name: data.first_name,
      last_name: data.last_name,
      current_weight: data.current_weight,
      current_age: data.current_age,
      email: data.email,
      mood: data.mood as userMood,
      goal: data.goal ?? "",
      authorized_email_id: data.authorized_email_id,
    };

    return (
    // need to prevent people from getting to this route if they're not signed in
    <div className="h-screen overflow-hidden bg-white">
        <ProviderDashboardShell profile={data}/>
    </div>
    );
}