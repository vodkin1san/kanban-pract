import { useState } from "react";
import { Dialog, Button } from "@mui/material";

interface ModalWrapperProps {
  children: (onClose: () => void) => React.ReactNode;
  openButtonText: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  openButtonText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <Button sx={{ mr: 3 }} onClick={handleOpen}>
        {openButtonText}
      </Button>
      <Dialog open={isOpen} onClose={handleClose}>
        {children(handleClose)}
      </Dialog>
    </>
  );
};

export { ModalWrapper };
