"use client"
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';
import SentimentNeutralRoundedIcon from '@mui/icons-material/SentimentNeutralRounded';
import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded';
import { useEffect, useState } from 'react';
import { updateMood, updateWeightAndAge } from '../clientDashboard/profileChange';
import GoalField from './goalField';
import type {userProfile} from '../types';
import Image from 'next/image';
import  MenuButton from "../../public/icons/Menu.svg"

type userMood = "unhappy" | "somewhat_unhappy" | "neutral" | "somewhat_happy" | "happy";

const userHappiness: {id: userMood, label: string, color: string, Icon: typeof SentimentDissatisfiedRoundedIcon}[] = [
    {id: 'unhappy', label:'Unhappy', color: "#D93737", Icon : SentimentDissatisfiedRoundedIcon},
    {id: 'somewhat_unhappy', label:'Somewhat Unhappy', color: "#F17D00", Icon : SentimentDissatisfiedRoundedIcon},
    {id: 'neutral', label:'Neutral', color: "#F1C100", Icon : SentimentNeutralRoundedIcon},
    {id: 'somewhat_happy', label:'Somewhat Happy', color: "#C3C360", Icon : SentimentSatisfiedRoundedIcon},
    {id:'happy', label:'Happy', color: "#45733F", Icon : SentimentSatisfiedRoundedIcon}
]

export default function userProfile({profile}: {profile: userProfile}){

    const [mood,setMood] = useState<userMood>(profile.mood);
    const [age, setAge] = useState<number>(profile.current_age ?? 0);
    const [weight, setWeight] = useState<number>(profile.current_weight ?? 0);

    useEffect(() => {
        setMood(profile.mood as userMood);
    }, [profile.mood]);

    useEffect(() => {
        setAge(profile.current_age ?? 0);
        setWeight(profile.current_weight ?? 0);
    }, [profile.current_age, profile.current_weight]);

    async function saveAgeAndWeight(nextAge: number, nextWeight: number) {
        if (!Number.isFinite(nextAge) || nextAge < 0) return;
        if (!Number.isFinite(nextWeight) || nextWeight < 0) return;
        const result = await updateWeightAndAge(nextWeight, nextAge);
        if (result instanceof Error) {
            console.error(result.message);
        }
    }

    useEffect(()=>{
        updateMood(mood);
    },[])

    return(
    <div className="flex w-fit flex-col bg-[#EDF1EC] p-5 my-5 rounded-lg">
        <div className="flex flex-col justify-center items-center gap-4 mt-10">
            <h2 className="text-black font-serif text-5xl">Welcome!</h2>
            <div className=" text-black font-semibold bg-white rounded-full p-1 mt-3 duration-300 ">
                <PersonRoundedIcon sx={{color: "currentColor", fontSize:50}}/>
            </div> 
            <h3 className="text-black font-inter font-normal  text-2xl ">
                {profile.first_name} {profile.last_name}</h3>
            {/* retrieve client name from the database */}
        </div>
        <div className="flex flex-col justify-center items-center gap-4 mt-7">
            <div className="bg-white h-8 w-full rounded-2xl flex items-center p-2 px-4
            text-black text-xs font-inter font-medium justify-between gap-2">
                <label className="flex items-center gap-1">
                    Age:
                    <input
                        type="number"
                        min={0}
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        onBlur={() => saveAgeAndWeight(age, weight)}
                        className="w-12 bg-transparent text-right outline-none 
                        [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none 
                        [&::-webkit-outer-spin-button]:appearance-none"
                        aria-label="Age"
                    />
                </label>
                <label className="flex items-center gap-1">
                    Weight:
                    <input
                        type="number"
                        min={0}
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        onBlur={() => saveAgeAndWeight(age, weight)}
                        className="w-14 bg-transparent text-right outline-none 
                        [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none 
                        [&::-webkit-outer-spin-button]:appearance-none"
                        aria-label="Weight"
                    />
                </label>
            </div>
            <div className="flex flex-col w-full h-full font-inter text-black">
                <h3 className="px-2 font-semibold text-[10px] mb-2">
                    My Current Weightloss Goals:
                </h3>
                {/* editable goals field */}
                <GoalField profileId={profile.authorized_email_id} profileGoal={profile.goal} />
            </div>
            <div className="flex flex-col w-full h-full font-inter text-black gap-2">
                <h3 className="px-2 font-semibold text-[10px]">
                    Are You Happy With Your Progress?
                </h3>
                {/* select mood level*/}
                <div className="bg-white h-fit w-full rounded-2xl flex p-3
                text-xs font-inter font-medium justify-between" >
                    {/* Map faces for moods as buttons */}
                    {userHappiness.map(({id, label, color, Icon}) => {
                        const activeMood = mood === id
                    return (
                        <button key={id} onClick={async () => {setMood(id);
                            await updateMood(id)
                        }}
                        className={activeMood? ` p-1 rounded-full text-white
                        hover:cursor-pointer duration-100 hover:-translate-y-1` : `duration-100 
                        hover:cursor-pointer hover:-translate-y-1`}
                        style={activeMood? {backgroundColor : color } : undefined}>
                            {Icon && <Icon sx={{color: activeMood? "white" : color , fontSize:30}}/>}
                        </button>
                    )
                    })}
                </div>
                <p className="self-end px-2 font-semibold text-[10px]"> Select One Of The Options</p>
            </div>
        </div>  
    </div>
    );
} 