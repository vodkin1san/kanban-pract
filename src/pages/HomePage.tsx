import { Link } from "react-router-dom";
import AppRoutes from "../enums/routes";
import { Button, Dialog } from "@mui/material";
import { useState } from "react";
import { useAppSelector } from "../store/hooks";
import { CreateColumnForm } from "./CreateColumnForm";
import { ColumnsList } from "../components/ColumnsList";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = useAppSelector((state) => state.user.uid);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Главная страница</h1>
      <p>This is the HomePage form. (To be implemented)</p>
      <p>
        Перейти на страницу входа: <Link to={AppRoutes.LOGIN}>Login</Link>
      </p>
      <p>
        Перейти на страницу регистрации: <Link to={AppRoutes.SIGNUP}>SignUp</Link>
      </p>
      <Button sx={{ mr: 3 }} onClick={handleOpenModal}>
        Создать колонку
      </Button>
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <CreateColumnForm onCancel={handleCloseModal} />
      </Dialog>
      <ColumnsList userId={userId} />
    </div>
  );
};

export { HomePage };
