import { NextRequest} from "next/server";
import {createClient} from '../../lib/supabase/server';



async function emailCheck(email : string){
    const supabase = await createClient();
    const {data, error} = await supabase
    .from('authorizedEmails')
    .select('id, email,first_name,last_name')
    .eq("email",email)
    .maybeSingle()

    console.log({ email, data, error });

    if(error){
        throw new Error(error.message);
    }else{
        return data
    }
    
}

export async function POST(req: NextRequest){
    const supabase = await createClient();
    const formData = await req.formData();
    const email = String(formData.get('email'));
    const password = String(formData.get('password')); 
    const normalizedEmail = email.trim().toLowerCase();
    const authorized = await emailCheck(normalizedEmail);
    
    if(!authorized){
        return Response.json({success: false, error : "User is Not Authorized"},
        { status: 403 });
    }

    const {data, error} = await supabase.auth.signUp({
        email: normalizedEmail,
        password: password,
    })
    if(error || !data.user){
        return Response.json({success: false, error : error?.message}) 
    }

    const {error : insertError} = await supabase.from("Users")
    .insert({
        email: normalizedEmail,
        authorized_email_id: authorized.id,
        auth_user_id: data.user.id,
        first_name: authorized.first_name,
        last_name: authorized.last_name
    });
    if(insertError){
        return Response.json({success: false, error : insertError.message}) 
    }

    return Response.json({success : true})
    //we have the username and password
    //now we need to validate that they are actually authorized on supabase
}

