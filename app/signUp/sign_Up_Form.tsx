"use client";

import { error } from "next/dist/build/output/log";
import { useRouter } from "next/navigation";
import type { SubmitEvent } from "react";

export default function SignUpForm() {
  // must fetch info from authorized users in the database and check
  // input email against that list of authorized emails
  const router = useRouter();
  async function handleSignUp(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();


    const currForm = e.currentTarget;
    const formData = new FormData(currForm);

    const response = await fetch('../api/signUp',{
      method: 'POST',
      body: formData,
    })
    const data = await response.json();
    
    if(data.success){
      router.push('/clientDashboard')
    }else{
      console.log(data)
    }

    currForm.reset();

  }

  return (
    <div className="flex flex-col">
      <form
        onSubmit={handleSignUp}
        className="flex flex-col border-[1px] font-inter bg-white
     border-gray-300 mx-15 my-5 rounded-[8px] p-6 text-left text-xs
     drop-shadow-xs text-gray-400"
      >
        <h2 className=" text-black text-xs mb-2">Email</h2>
        <input
          type="email"
          name="email"
          className="border-[1px]
      border-gray-300 rounded mb-5 p-2 w-full"
          placeholder={"Enter your email"}
        />
        <h2 className=" text-black text-xs mb-2">Password</h2>
        <input
          type="password"
          name="password"
          className="border-[1px]
      border-gray-300 rounded mb-5 p-2 w-full"
          placeholder={"Enter your password"}
        />
        <input
          type="submit"
          value={'Register'}
          className="rounded-md text-white bg-black my-2 p-2
      cursor-pointer hover:opacity-90"
        />
      </form>
      <p className="text-black font-inter text-xs">
        already have an account?
        <a className="underline ml-1" href="/signIn">
          Sign In
        </a>
      </p>
    </div>
  );
}
