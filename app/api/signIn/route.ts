import { NextRequest} from "next/server";
// import { createClient} from '@supabase/supabase-js';
import {createClient} from '../../lib/supabase/server';



export async function POST(req: NextRequest){
    const supabase = await createClient(); 
    const formData = await req.formData();
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    //should probably add MFA
    const normalizedEmail = email.trim().toLowerCase();
    const {data, error} = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password,
    })
    const {data : roleData, error : roleError} = await supabase.from("Users").select("role").eq(
        "auth_user_id", data.user?.id).maybeSingle()
    
    
    if(data.user?.aud === "authenticated" && !error && !roleError){
        return Response.json({success:true, role : roleData?.role},)
    }else{
        return Response.json({success: false, error: error?.message, roleError: roleError?.message})
    }
}
