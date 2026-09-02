import { NextRequest} from "next/server";
import { createClient} from '@supabase/supabase-js';
import { redirect } from "next/navigation";

const supaUrl = process.env.SUPABASE_URL;
const supaKey = process.env.SUPABASE_SECRETKEY;
if(!supaUrl || !supaKey){
    throw new Error("Missing SUPABASE_KEY OR URL")
}
const supabase = createClient(supaUrl,supaKey);



export async function POST(req: NextRequest){

    const {data : {user}} = await supabase.auth.getUser(); 

    if(!user){
        redirect("/signIn");
    }

    const {data, error} = await supabase.from("Users")
    .select("first_name,last_name,current_weight,current_age,email,mood,authorized_email_id,goal")
    .eq("auth_user_id", user?.id )
    .maybeSingle();

    if(error){
        return Response.json({success: false , message: "Error Retrieving User Profile", errMessage : error.message})
    }else{
        return Response.json(data)
    }

    return <ClientDashboardShell profile={data}/>

}