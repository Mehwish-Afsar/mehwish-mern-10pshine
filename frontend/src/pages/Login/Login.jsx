import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28 px-4">
        <div className="w-full max-w-md border border-gray-200 rounded-xl bg-white px-7 py-10 shadow-sm">
          
          <form onSubmit={() => {}} className="space-y-6">
            <h4 className="text-2xl font-semibold text-gray-800 text-center">
              Login
            </h4>
            <input type="text" placeholder="Email" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"/>
            
            <button type="submit" className="w-full rounded-lg bg-indigo-600 py-2.5 text-white font-medium hover:bg-indigo-700 transition">
              Login
            </button>

            <p className="text-sm text-center text-gray-600">
              Not Registered yet?{" "}
              <Link to="/signUp" className="font-medium text-indigo-600 hover:text-indigo-700 underline">
                Create An Account
              </Link>
            </p>
          </form>

        </div>
      </div>
    </>
  );
};

export default Login;
