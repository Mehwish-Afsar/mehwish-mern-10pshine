import { Check, Trash } from "lucide-react";
import React, { useEffect } from "react";

const Message = ({ isShown, message, type = "success", onClose }) => {

  useEffect(() => {
    if (!isShown) return;

    const timeoutId = setTimeout(() => {
      onClose && onClose();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [isShown, onClose]);

  if (!isShown || !message) return null;

  return (
    <div className="fixed top-20 right-6 z-50 transition-all duration-300 opacity-100">
      <div
        className={`relative min-w-[220px] bg-white border border-slate-200 shadow-2xl rounded-md
        after:content-[''] after:absolute after:left-0 after:top-0 after:h-full after:w-1
        ${type === "delete" ? "after:bg-red-500" : "after:bg-green-500"}`}
      >
        <div className="flex items-center gap-3 py-3 px-4">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full
            ${type === "delete" ? "bg-red-50" : "bg-green-50"}`}
          >
            {type === "delete" ? (
              <Trash className="text-red-500" />
            ) : (
              <Check className="text-green-500" />
            )}
          </div>

          <p className="text-sm text-slate-800">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;
