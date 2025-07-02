import { useNavigate, Link } from "react-router-dom";
import AppRoutes from "@enums/routes";
import { Button, Alert } from "@mui/material";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import { CreateColumnForm } from "./CreateColumnForm";
import { ColumnsList } from "@modules/columns/ColumnsList/index";
import { logoutUser } from "@store/userSlice";
import { ModalWrapper } from "@modules/columns/ModalWrapper/index";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { uid: userId, error: userError } = useAppSelector(
    (state) => state.user,
  );

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(resultAction)) {
      navigate(AppRoutes.LOGIN);
    }
  };

  return (
    <div>
      <h1>Главная страница</h1>
      <p>This is the HomePage form. (To be implemented)</p>
      <p>
        Перейти на страницу входа: <Link to={AppRoutes.LOGIN}>Login</Link>
      </p>
      <p>
        Перейти на страницу регистрации:{" "}
        <Link to={AppRoutes.SIGNUP}>SignUp</Link>
      </p>
      {userError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {userError}
        </Alert>
      )}

      {userId ? (
        <>
          <ModalWrapper openButtonText="Создать колонку">
            {(onClose) => (
              <CreateColumnForm
                onCancel={onClose}
                onSuccess={onClose}
                userId={userId}
              />
            )}
          </ModalWrapper>
          <ColumnsList userId={userId} />
          <Button sx={{ mr: 3 }} onClick={handleLogout}>
            Выйти
          </Button>
        </>
      ) : (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Пожалуйста, авторизуйтесь, чтобы управлять колонками.
        </Alert>
      )}
    </div>
  );
};

export { HomePage };
