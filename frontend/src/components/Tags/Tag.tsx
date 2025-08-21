import React from "react";

interface TagProps {
  color?: string;
  tagName?: string;
}

const Tag = (props: TagProps) => {
  return (
    <span
      className="inline-block px-2 rounded text-[13px] h-5 font-semibold text-white"
      style={{ backgroundColor: props?.color || "#d7e1fe" }}
    >
      {props?.tagName}
    </span>
  );
};

export default Tag;