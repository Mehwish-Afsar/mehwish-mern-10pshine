import React from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constant";

const ProfileInfo = ({ userInfo }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/profile")}>
      <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden bg-slate-100">
        {userInfo.image ? (
          <img src={`${BASE_URL}${userInfo.image}`} alt="profile" className="w-full h-full object-cover"/>
          ) : (<span className="text-slate-950 font-medium">
            {userInfo.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </span>
            )}
      </div>

      <div className="leading-tight">
        <p className="text-sm font-medium">{userInfo.fullName}</p>
        <p className="text-xs text-slate-500">View profile</p>
      </div>
    </div>
  );
};

export default ProfileInfo;
