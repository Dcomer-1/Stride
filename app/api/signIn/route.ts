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
    if(data.user?.aud === "authenticated"){
        return Response.json({success:true, message: "User Successfully Authenticated"},)
    }else{
        return Response.json({success: false, error: error?.message})
    }
}
