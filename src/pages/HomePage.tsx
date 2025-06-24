import { Link as MuiLink, Button, Dialog } from "@mui/material";
import { signOut } from "firebase/auth";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { clearUser } from "../store/userSlice";
import { useEffect, useState } from "react";
import { CreateColumnForm } from "./CreateColumnForm";
import AppRoutes from "../enums/routes";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchColumn } from "../store/columnSlice";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.uid);
  const columns = useAppSelector((state) => state.column.items);
  const isLoading = useAppSelector((state) => state.column.isLoading);
  const error = useAppSelector((state) => state.column.error);

  const navigator = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      navigator(AppRoutes.LOGIN);
    } catch (error) {
      console.error("Выход не удался: ", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchColumn(userId));
    }
  }, [dispatch, userId]);

  return (
    <>
      <MuiLink sx={{ mr: 3 }} component={RouterLink} to={AppRoutes.SIGNUP} variant="body2">
        {"На тест поля singup"}
      </MuiLink>

      <MuiLink sx={{ mr: 3 }} component={RouterLink} to={AppRoutes.LOGIN} variant="body2">
        {"На тест поля login"}
      </MuiLink>

      <Button sx={{ mr: 3 }} onClick={handleLogout}>
        Выйти
      </Button>
      <Button sx={{ mr: 3 }} onClick={handleOpenModal}>
        Создать колонку
      </Button>
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <CreateColumnForm onCancel={handleCloseModal} />
      </Dialog>

      <h1>Твоя главная страница</h1>
      {isLoading && <p>Загрузка колонок...</p>}
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

      <h2>Мои Колонки ТЕСТ:</h2>
      {columns.length > 0 ? (
        <ul>
          {columns.map((column) => (
            <li key={column.id}>
              {column.name} (ID: {column.id})
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && !error && <p>У вас пока нет колонок. Создайте новую!</p>
      )}
    </>
  );
};

export { HomePage };
