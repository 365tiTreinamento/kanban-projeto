import React, { type ReactNode } from "react";
import "./Modal.css";

interface ModalProps {
  onClose: (show: boolean) => void;
  children: ReactNode;
}

const Modal = (props: ModalProps) => {
  return (
    <div className="custom__modal" onClick={() => props.onClose(false)}>
      <div
        className="modal__content"
        onClick={(event) => event.stopPropagation()}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Modal;