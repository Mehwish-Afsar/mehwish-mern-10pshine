import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    setError("");
    setSuccess("");

    try {
      await axiosInstance.post(`/reset-password/${token}`, {
        password: newPassword,
      });

      setSuccess("Password reset successful! Redirecting to login...");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Invalid or expired reset link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl px-8 py-10 shadow-lg">

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-600">Notexa</h2>
          <p className="text-sm text-gray-500 mt-1">
            Secure your account with a new password
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleReset}>
          <h4 className="text-xl font-semibold text-center">
            Reset Password
          </h4>

          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />

          {success && (
            <p className="text-green-600 text-sm text-center">{success}</p>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition duration-200 py-2.5 text-white rounded-lg font-medium shadow-sm"
          >
            Reset Password
          </button>

          <p className="text-sm text-center text-gray-600">
            Remembered your password?{" "}
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

export default ResetPassword;
