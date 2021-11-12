import React from "react";

const ModalButton = (props) => {
  return (
    <button
      type="button"
      onClick={props.setOpen}
      className={props.buttonStyle}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default ModalButton;
