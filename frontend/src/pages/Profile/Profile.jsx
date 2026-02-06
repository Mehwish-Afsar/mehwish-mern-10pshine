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
      await axiosInstance.put("/change-password", {
        currentPassword,
        newPassword,
      });
      setMessage("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setError("Current password is incorrect");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <button onClick={handleBack} className="mt-4 inline-flex items-center justify-center 
      rounded-lg bg-indigo-600 px-3 py-2.5 text-white font-medium hover:bg-indigo-700 transition gap-1">
      <ArrowLeft />Back
      </button>
      <div className="mx-auto max-w-4xl space-y-10">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Profile</h1>
          <p className="text-slate-500 mt-1">Manage your account information and security</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
             <img src={image? URL.createObjectURL(image): user.image? `${BASE_URL}${user.image}`
            : "/avatar.png"} alt="profile"
            className="w-28 h-28 rounded-full object-cover border border-slate-300"/>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white 
              text-sm font-medium opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition">
                Change
                <input type="file" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])}/>
              </label>
            </div>
            <div>
              <h3 className="text-lg font-medium">{user.fullName}</h3>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)}className="mt-1 w-full
               rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Email
              </label>
              <input disabled value={user.email} className="mt-1 w-full rounded-lg border border-slate-200
               bg-slate-100 px-3 py-2 text-slate-500"/>
            </div>
          </div>

          <button
            onClick={handleProfileUpdate}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 
            py-2.5 text-white font-medium hover:bg-indigo-700 transition">
            Save Profile
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">

          <div>
            <h2 className="text-xl font-semibold text-slate-900">Security</h2>
            <p className="text-sm text-slate-500">
              Update your password to keep your account secure
            </p>
          </div>

          <div className="grid gap-4">
            <input type="password" placeholder="Current password" value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none 
              focus:ring-2 focus:ring-indigo-500"/>

            <input type="password" placeholder="New password" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none 
              focus:ring-2 focus:ring-indigo-500"/>
          </div>

          <button onClick={handleChangePassword} className="inline-flex items-center justify-center
           rounded-lg bg-slate-800 px-5 py-2.5 text-white font-medium hover:bg-slate-900 transition">
            Change Password
          </button>
        </div>

        {message && (<div className="rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 
        py-2 text-sm">{message}</div>
        )}

        {error && (<div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-2 
        text-sm">{error}</div>
        )}

        <div className="text-center">
          <button onClick={handleLogout} className="px-5 py-2.5 text-white font-medium hover:text-red-700
           w-full bg-red-600 rounded-lg">Log out</button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
