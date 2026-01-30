import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post(
        `/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message);
      setError("");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Invalid or expired reset link");
    }
  };
  

  return (
    <div className="flex justify-center mt-24">
      <div className="w-full max-w-md bg-white p-6 rounded border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-3 py-2 rounded border border-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
