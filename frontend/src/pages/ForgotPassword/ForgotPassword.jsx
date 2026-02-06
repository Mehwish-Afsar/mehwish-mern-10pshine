import React, { useState } from "react";
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

    try {
      const response = await axiosInstance.post("/forgot-password", { email });
      setMessage("Password reset link sent to your email");
      setError("");
    } catch (err) {
      setError("Email not found");
    }
  };

  return (
    <div className="flex justify-center mt-24">
      <div className="w-full max-w-md bg-white p-6 rounded border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
