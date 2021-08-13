import React from "react";
import Modal from "@material-ui/core/Modal";

const ModalComponent = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <button type="button" onClick={handleOpen} className={props.buttonStyle}>
        {props.button}
      </button>
      <Modal open={open} onClose={handleClose}>
        {props.children}
      </Modal>
    </div>
  );
};

export default ModalComponent;
