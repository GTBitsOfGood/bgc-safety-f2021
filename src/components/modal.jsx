import React from "react";
import Modal from "@material-ui/core/Modal";

const ModalComponent = (props) => {
  const { open, setOpen } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      {props.children}
    </Modal>
  );
};

export default ModalComponent;
