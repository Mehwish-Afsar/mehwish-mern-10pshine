import React from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 bg-slate-100 rounded-md">
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full text-xs bg-transparent py-[11px] outline-none"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />

      {value && (
        <X
          className="text-xl text-slate-500 cursor-pointer hover:text-black mr-1"
          onClick={() => {
            onClearSearch();
            handleSearch();
          }}
        />
      )}

      <Search
        className="text-slate-400 cursor-pointer hover:text-black"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
