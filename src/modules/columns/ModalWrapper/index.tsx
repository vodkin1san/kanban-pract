import { useState } from "react";
import { Dialog, Button, IconButton } from "@mui/material";

export interface ModalWrapperProps {
  children: (onClose: () => void) => React.ReactNode;
  openButtonText?: string;
  openButtonIcon?: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  openButtonText,
  openButtonIcon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderButton = () => {
    if (openButtonIcon) {
      return (
        <IconButton onClick={() => setIsOpen(true)}>
          {openButtonIcon}
        </IconButton>
      );
    }
    if (openButtonText) {
      return (
        <Button
          onClick={() => setIsOpen(true)}
          variant="contained"
          color="primary"
        >
          {openButtonText}
        </Button>
      );
    }
    return null;
  };
  return (
    <>
      {renderButton()}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        {children(() => setIsOpen(false))}
      </Dialog>
    </>
  );
};

export { ModalWrapper };
