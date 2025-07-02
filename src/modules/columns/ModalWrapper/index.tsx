import { useState } from "react";
import { Dialog, Button } from "@mui/material";

export interface ModalWrapperProps {
  children: (onClose: () => void) => React.ReactNode;
  openButtonText: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  openButtonText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button sx={{ mr: 3 }} onClick={() => setIsOpen(true)}>
        {openButtonText}
      </Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        {children(() => setIsOpen(false))}
      </Dialog>
    </>
  );
};

export { ModalWrapper };
