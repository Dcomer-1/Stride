import { SubmitEvent, useEffect, useState } from "react";
import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';
import saveIcon from "../../public/icons/Save.svg";
import deleteIcon from "../../public/icons/delete.svg"; 
import { clearGoal, updateGoal } from "./profileChange";



export default function goalField({profileId, profileGoal} : {profileId : string, profileGoal : string}){
    const [goalText, setGoalText] = useState(profileGoal ?? "");

    // useEffect to reRender the page when goalText is changed

    useEffect(() =>{
        setGoalText(profileGoal ?? "")
    },[profileGoal]);

    return(
        <div className="flex flex-col gap-2">
            <div className="bg-white h-fit  rounded-2xl flex p-3
        text-xs font-inter font-medium">
                <textarea
                name="goals"
                placeholder="*Enter Your Weightloss Goals Here* 
                (The Doctor Can View Them)"
                cols={25}
                rows={10}
                onChange={(e)=>{setGoalText(e.target.value)}}
                value={goalText}
                className="resize-none focus:outline-none ">
                
                </textarea>
                <ModeEditRoundedIcon sx={{fontSize:20}}/>
            </div>
            <div className="text-[10px] self-end font-inter font-medium flex">
                <button className="bg-[#D93737] p-1 rounded-md mr-1 
                text-white hover:cursor-pointer inline-flex items-center 
                justify-center gap-1 hover:bg-[#B82E2E] shadow-sm"
                onClick={()=>{clearGoal();
                    setGoalText('');
                }}>
                <img
                src={typeof deleteIcon === "string"? deleteIcon : deleteIcon.src }
                alt="save icon"
                className="size-4"
                />
                Clear</button>
                <button className="bg-[#45733F] p-1 rounded-md 
                text-white hover:cursor-pointer inline-flex items-center 
                justify-center gap-1 hover:bg-[#3A6235] shadow-sm"
                type="submit"
                onClick={()=>{updateGoal(goalText)}}>
                <img
                src={typeof saveIcon === "string"? saveIcon : saveIcon.src }
                alt="save icon"
                className="size-4"
                />
                
                Save Changes</button>

            </div>

        </div>

    );
}