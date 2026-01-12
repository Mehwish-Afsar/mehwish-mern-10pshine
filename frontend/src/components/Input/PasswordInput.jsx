import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [IsShowPassword, setIsShowPassword] = useState(false);

  return (
    <div className="flex items-center border border-gray-200 px-4 rounded-lg">
      <input
        value={value}
        onChange={onChange}
        type={IsShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="w-full py-3 outline-none"
      />

      {IsShowPassword ? (
        <Eye onClick={() => setIsShowPassword(false)} />
      ) : (
        <EyeOff onClick={() => setIsShowPassword(true)} />
      )}
    </div>
  );
};

export default PasswordInput;
