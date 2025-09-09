import { useState, useEffect } from "react";
import { Dialog, Button, IconButton } from "@mui/material";

export interface ModalWrapperProps {
  children: (onClose: () => void) => React.ReactNode;
  openButtonText?: string;
  openButtonIcon?: React.ReactNode;
  openInitially?: boolean;
  onClose?: () => void;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  openButtonText,
  openButtonIcon,
  openInitially = false,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(openInitially);

  useEffect(() => {
    setIsOpen(openInitially);
  }, [openInitially]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

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
      <Dialog open={isOpen} onClose={handleClose}>
        {children(handleClose)}
      </Dialog>
    </>
  );
};

export { ModalWrapper };
