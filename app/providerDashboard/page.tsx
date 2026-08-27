
import { ResponseAbortedName } from "next/dist/server/web/spec-extension/adapters/next-request";
import NavigationBar from "../components/navigationBar";
import UserProfile from "../components/userProfile";
import { createClient} from '@supabase/supabase-js';
import ProviderDashboardShell from "./providerDashboardShell";


export default async function ClientDashboard() {

    const response = await fetch("http://localhost:3000/api/profile",{
        method: 'POST',
    });
    
    const data = await response.json() 

    return (
    // need to prevent people from getting to this route if they're not signed in
    <div className="min-h-screen min-w-full bg-white overflow-x-hidden grid grid-cols-3">
        <ProviderDashboardShell profile={data}/>
    </div>
    );
}