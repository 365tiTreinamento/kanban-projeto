import React from "react";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-8 border-b border-gray-300 max-h-[50px] text-gray-900">
      <h2 className="text-lg font-semibold">Kanban Board</h2>

      <div className="relative">
        {/* Checkbox invisível */}
        <input
          type="checkbox"
          id="theme-toggle"
          className="absolute opacity-0 w-0 h-0 peer"
        />

        {/* Label customizado */}
        <label
          htmlFor="theme-toggle"
          className="flex items-center justify-between w-[36px] h-[11px] bg-black rounded-full p-1 relative scale-150 cursor-pointer"
        >
          <i className="fas fa-moon text-pink-500 text-sm"></i>
          <i className="fas fa-sun text-yellow-400 text-sm"></i>

          {/* Ball */}
          <div className="absolute w-4 h-4 bg-white rounded-full top-[2px] left-[2px] transition-transform duration-200 peer-checked:translate-x-6" />
        </label>
      </div>
    </div>
  );
}
