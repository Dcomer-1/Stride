import { NextRequest} from "next/server";
import { createClient} from '@supabase/supabase-js';

const supaUrl = process.env.SUPABASE_URL;
const supaKey = process.env.SUPABASE_SECRETKEY;
if(!supaUrl || !supaKey){
    throw new Error("Missing SUPABASE_KEY OR URL")
}
const supabase = createClient(supaUrl,supaKey);



export async function POST(req: NextRequest){
    const {data, error} = await supabase.from("Users")
    .select("first_name,last_name,current_weight,current_age,email,mood,authorized_email_id,goal")
    .maybeSingle();

    if(error){
        return Response.json({success: false , message: "Error Retrieving User Profile"})
    }else{
        return Response.json(data)
    }

}