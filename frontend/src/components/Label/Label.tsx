import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { Check, X } from "react-feather";

interface TagType {
  id: string;
  name: string;
  color: string;
  cardId: string;
}

interface LabelProps {
  color: string[];
  tags: TagType[];
  addTag: (name: string, color: string) => void;
  onClose: (show: boolean) => void;
}

export default function Label(props: LabelProps) {
  const input = useRef<HTMLInputElement>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [label, setLabel] = useState<string>("");

  const isColorUsed = (color: string): boolean => {
    const isFound = props.tags.find((item) => item.color === color);
    return !!isFound;
  };

  return (
    <div className="relative">
      <div className="absolute left-[55%] top-[55%] w-[400px] max-w-[100%] flex justify-center items-center bg-white z-30">
        <div className="max-h-[95vh] shadow-lg rounded p-2 w-full mb-2 overflow-auto">
          {/* Heading */}
          <div className="flex justify-between items-center border-b border-gray-300 my-2">
            <p className="text-center text-[15px] font-bold">
              Etiqueta
            </p>
            <X
              onClick={() => props.onClose(false)}
              className="w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            {/* Label Name */}
            <p className="text-[#5e6c84] text-[12px] font-bold leading-4">
              Nome
            </p>
            <div className="w-full">
              <input
                type="text"
                ref={input}
                defaultValue={label}
                placeholder="Nome da etiqueta"
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-gray-50 border-none rounded shadow-inner border-2 border-gray-300 p-2 outline-none transition duration-75 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Color Selection */}
            <p className="text-[#5e6c84] text-[12px] font-bold leading-4">
              Selecionar cor
            </p>
            <div className="flex flex-wrap gap-1 mb-2">
              {props.color.map((item, index) => (
                <span
                  key={index}
                  onClick={() => setSelectedColor(item)}
                  className={`min-w-[52px] h-8 rounded font-semibold text-white flex items-center justify-center 
                ${isColorUsed(item) ? "opacity-40 pointer-events-none" : "cursor-pointer"}`}
                  style={{ backgroundColor: item }}
                >
                  {selectedColor === item && <Check className="w-5 h-5" />}
                </span>
              ))}
            </div>

            {/* Create Button */}
            <button
              className="bg-blue-600 hover:bg-blue-800 text-white text-sm h-8 rounded mb-1 transition-colors w-full mt-5"
              onClick={() => {
                if (!label) return;
                if (!selectedColor) {
                  alert("Por favor, selecione uma cor");
                  return;
                }
                props.addTag(label, selectedColor);
                setSelectedColor("");
                setLabel("");
                if (input.current) input.current.value = "";
              }}
            >
              Criar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}