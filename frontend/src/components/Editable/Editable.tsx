import { useState, type FormEvent } from "react";
import { Plus, X } from "react-feather";

interface EditableProps {
  parentClass?: string;
  class?: string;
  handler?: boolean;
  defaultValue?: string;
  placeholder?: string;
  btnName?: string;
  name?: string;
  onSubmit?: (text: string) => void;
  setHandler?: (show: boolean) => void;
}

const Editable = (props: EditableProps) => {
  const [show, setShow] = useState(props?.handler || false);
  const [text, setText] = useState(props.defaultValue || "");

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text && props.onSubmit) {
      setText("");
      props.onSubmit(text);
    }
    setShow(false);
  };

  return (
    <div className={`${props.parentClass || ""} h-auto`}>
      {show ? (
        <form onSubmit={handleOnSubmit}>
          <div className={`flex flex-col gap-2 px-2 ${props.class || ""}`}>
            <textarea
              placeholder={props.placeholder}
              autoFocus
              id="edit-input"
              onChange={(e) => setText(e.target.value)}
              value={text}
              className="w-full bg-gray-50 border-none rounded shadow-inner border-2 border-gray-300 p-2 outline-none focus:ring-1 focus:ring-blue-500 transition duration-75"
            />
            <div className="flex gap-1 items-center px-0.5">
              <button
                type="submit"
                className="w-32 bg-blue-600 hover:bg-blue-800 text-white text-sm h-8 rounded mb-1 transition-colors"
              >
                {props.btnName || "Adicionar"}
              </button>
              <X
                className="hover:cursor-pointer"
                onClick={() => {
                  setShow(false);
                  props?.setHandler?.(false);
                }}
              />
            </div>
          </div>
        </form>
      ) : (
        <p
          onClick={() => setShow(true)}
          className="w-[90%] flex gap-1 rounded p-2 mx-auto hover:bg-gray-300 hover:text-black hover:cursor-pointer transition ease-in-out duration-200"
        >
          {props.defaultValue === undefined ? <Plus /> : null}
          {props.name || "Adicionar"}
        </p>
      )}
    </div>
  );
};

export default Editable;
