import React, { useRef, useEffect } from "react";

interface DropdownProps {
  className?: string;
  onClose?: () => void;
  children: React.ReactNode;
}

const Dropdown = ({ className = "", onClose, children }: DropdownProps) => {
  const dropRef = useRef<HTMLDivElement>(null);

  const handleClick = (event: MouseEvent) => {
    if (dropRef.current && !dropRef.current.contains(event.target as Node) && onClose) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={dropRef}
      className={`
        absolute right-0 top-10
        rounded-md
        min-h-[40px] min-w-[80px]
        w-fit h-fit
        max-w-[250px] max-h-[390px]
        overflow-y-auto
        z-10
        px-4 py-2
        bg-[var(--drop-down-color)]
        shadow-md
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Dropdown;
