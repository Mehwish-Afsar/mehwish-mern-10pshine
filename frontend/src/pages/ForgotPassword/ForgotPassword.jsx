import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setError("");
    setMessage("");

    try {
      await axiosInstance.post("/forgot-password", { email });
      setMessage("Password reset link sent! Please check your email.");
    } catch (err) {
      setError("Email not found");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl px-8 py-10 shadow-lg">

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-600">Notexa</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email to receive a password reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <h4 className="text-xl font-semibold text-center">
            Forgot Password
          </h4>

          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {message && (
            <p className="text-green-600 text-sm text-center">{message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition duration-200 py-2.5 text-white rounded-lg font-medium shadow-sm"
          >
            Send Reset Link
          </button>

          <p className="text-sm text-center text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
