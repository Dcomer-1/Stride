import FoodImage from "../../public/images/HealthyFood.svg";
import SignInForm from "./sign_In_Form";
import Image from "next/image";
export default function SignInPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-white">
      <div className="flex flex-col justify-center text-center ">
        <a className="flex items-center gap-2 text-black mb-3 p-6">logo placeholder</a>
        <h2 className="text-5xl font-serif text-[#4C7B46] mb-2"> Ready To Start Your <br/>
        Health Journey?</h2>
        <h3 className="text-xs text-black font-inter"> 
          Everything you need to keep your health in check - all in one place</h3>
        <div>
          <SignInForm />    
        </div>
      </div>
      <div className="relative lg:block">
        <Image
          src={typeof FoodImage === "string" ? FoodImage : FoodImage.src}
          alt="healthy cooking"
          className="object-cover"
          priority
          fill
        />
      </div>
    </div>
  );
}
