import { useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";

export default function SignIn() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full bg-[#fff] text-white flex flex-col">
      <div className="flex justify-center mt-10">
        <div
          className="relative w-60 h-16 bg-gray-700 rounded-full flex items-center p-1 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {/* Sliding Button */}
          <div
            className={`absolute top-1 left-1 h-14 w-28 bg-[#3C5B6F] rounded-full transition-all duration-300 ${
              isLogin ? "translate-x-0" : "translate-x-full"
            }`}
          ></div>

          {/* Text Inside the Slider */}
          <div className="w-28 h-5 text-center font-semibold z-10">Login</div>
          <div className="w-28 h-5 text-center font-semibold z-10">Sign Up</div>
        </div>
      </div>
      {/* Login or SignUp Form (Centered on Screen) */}
      <div className="flex-grow flex items-center justify-center">
        {isLogin ? <Login /> : <SignUp />}
      </div>
    </div>
  );
}
