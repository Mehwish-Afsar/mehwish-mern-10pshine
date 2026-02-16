import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BASE_URL } from "../../utils/constant";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axiosInstance.get("/get-user");
        setUser(res.data.user);
        setFullName(res.data.user.fullName);
      } catch {
        navigate("/login");
      }
    };
    getUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleProfileUpdate = async () => {
    try {
      setError("");
      setMessage("");

      const formData = new FormData();
      formData.append("fullName", fullName);
      if (image) formData.append("image", image);

      const res = await axiosInstance.put("/update-profile", formData);
      setUser(res.data.user);
      setImage(null);
      setMessage("Profile updated successfully");
    } catch {
      setError("Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    try {
      setError("");
      setMessage("");
      await axiosInstance.put("/change-password", { currentPassword, newPassword });
      setMessage("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setError("Current password is incorrect");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl px-8 py-10 shadow-lg space-y-6">
        
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition duration-200 py-2.5 text-white rounded-lg font-medium shadow-sm px-3 py-2 text-white font-medium hover:bg-indigo-700 transition"
        >
          <ArrowLeft /> Back
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-600">Profile</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your account info and security</p>
        </div>

        {/* Profile Picture & Info */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : user.image
                  ? `${BASE_URL}${user.image}`
                  : "/avatar.png"
              }
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border border-gray-300"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm font-medium opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition">
              Change
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>
          <h3 className="text-lg font-medium">{user.fullName}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* Full Name */}
        <div className="space-y-4">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Full Name"
          />
        </div>

        <button
          onClick={handleProfileUpdate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition duration-200 py-2.5 text-white rounded-lg font-medium shadow-sm"
        >
          Save Profile
        </button>

        {/* Password Change */}
        <div className="space-y-4 mt-4">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        <button
          onClick={handleChangePassword}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition duration-200 py-2.5 text-white rounded-lg font-medium shadow-sm"
        >
          Change Password
        </button>

        {/* Messages */}
        {message && (
          <p className="text-green-600 text-sm text-center">{message}</p>
        )}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 transition duration-200 py-2.5 text-white rounded-lg font-medium shadow-sm"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
