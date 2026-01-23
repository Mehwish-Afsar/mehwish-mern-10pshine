import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validationEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";


const SignUp=()=>{

    const [name, setName]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [error, setError]=useState(null);

    const navigate=useNavigate()

    const handleSignup=async(e)=>{
        e.preventDefault();

        if(!name){
            setError("Please enter your name");
            return;
        }
        if(!validationEmail(email)){
            setError("Please enter a valid email");
            return;
        }
        if(!password){
            setError("Please enter the password");
            return;
        }
        setError("");
        // Signup API calls
        try{
            const response=await axiosInstance.post("/create-account",{
            fullName: name,
            email:email,
            password:password
        })
        // Handle successful Registration response
        if(response.data && response.data.accessToken){
            setError(response.data.message)
            return
        }
        if(response.data && response.data.accessToken){
            localStorage.setItem("token", response.data.accessToken)
            navigate("/dashboard")
        }
    }catch(error){
      // Handle Login Error
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message)
      }else{
        setError("An unexpected error occured. Please try again")
      }

    }
    }
    return (
        <>
            <div className="flex items-center justify-center mt-22 px-4 ">
                <div className="w-full max-w-md border border-gray-300 rounded-xl bg-white px-7 py-10 shadow-sm">
                    <form onSubmit={handleSignup} className="space-y-6">
                        <h4 className="text-2xl font-semibold text-center">Sign Up</h4>
                        <input
                        type="text"
                        placeholder="Name"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                        <input
                        type="text"
                        placeholder="Email"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />

                        <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && <p className="text-red-500 text-xs">{error}</p>}

                        <button className="w-full bg-indigo-600 py-2.5 text-white rounded-lg">
                        Create Account
                        </button>

                        <p className="text-sm text-center">
                        Already have an account{" "}
                        <Link to="/login" className="text-indigo-600 underline">
                            Login
                        </Link>
                        </p>
                    
                        
                    </form>
                </div>
            </div>
        </>
    )
}
export default SignUp;