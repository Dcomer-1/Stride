"use client";

import Image from "next/image";
import { useState } from "react";
import vegetables from "../../public/images/Vegetables.png";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { shadowsIntoLight, inter } from "../fonts";
import CheckCircle from "../../public/Check circle.svg"
import { useRouter } from "next/navigation"

export default function LandingPage() {
    const [signUp, setSignUp] = useState(false);
    const [signIn, setSignIn] = useState(false); 
    const router = useRouter();

    function handleSignUp(){
      router.push('/signUp')
    }

    function handleSignIn(){
      router.push('/signIn')
    }

  return (
    <div className="min-h-svh  bg-white overflow-x-hidden ">
      <main className=" w-full justify-between grid grid-cols-2 ">
        {/* left side */}
        <div className="flex flex-col md:justify-center md:ml-10 text-black">
          {/* add company logo */}
            <h3 className={`${shadowsIntoLight.className} text-4xl`}>
                Diet and Goal Logging
            </h3>
            <h1 className="text-8xl font-serif text-[#4C7B46] leading-21">
                Better Habits,<br/> For A Better You!
            </h1>
            <h3 className={`${shadowsIntoLight.className} text-right md:mb-10 text-black text-4xl`}>
              w/ Dr. Miriam N. James
            </h3>
            <ul className={`${inter.className} flex flex-col gap-6 font-normal text-2xl`}>
              <li className="text-black inline-flex items-center gap-2.5">
                <Image src={CheckCircle} alt="check circle" width={24} height={24} /> 
                Custom Diet Feedback From Board Certified Doctor</li>
              <li className="text-black inline-flex items-center gap-2.5">
                <Image src={CheckCircle} alt="check circle" width={24} height={24} />
                Food Logging
              </li>
              <li className="text-black inline-flex items-center gap-2.5">
              <Image src={CheckCircle} alt="check circle" width={24} height={24} /> 
                Weightloss Goal Logging </li>
            </ul>
            {/* add on hover */}
            <div className="mt-10 flex items-center gap-3  ">
              <button className={`${inter.className} inline-flex h-10 items-center justify-center rounded-xl 
               bg-[#4C7B46] px-4 text-base text-white hover:cursor-pointer
              transition duration-300 hover:-translate-y-2`}
              onClick={handleSignUp}>
                Sign Up
              </button>
              <button className={`${inter.className} bg-white inline-flex h-10 items-center justify-center gap-1 
               rounded-xl border-2 border-[#4C7B46] px-4 text-base font-medium text-[#4C7B46] 
              hover:cursor-pointer transition duration-300 hover:-translate-y-2`}
              onClick={handleSignIn}>
                Sign In
                <ArrowForwardIcon sx={{ color: "#4C7B46", fontSize: 18 }} />
              </button>
            </div>
        </div>
        {/* right half */}
        <div className=" relative min-h-svh scale-x-[-1] ">
          <Image src={vegetables}
           alt="Vegetables" 
           className="object cover"
           fill
           priority
           sizes=""
           />
        </div>
      </main>
    </div>
  );
}
