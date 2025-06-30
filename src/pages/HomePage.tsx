import AppRoutes from "../enums/routes";
import { Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { logoutUser } from "../store/userSlice";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(resultAction)) {
      navigate(AppRoutes.LOGIN);
    }
  };
  return (
    <div>
      <h1>Home Page</h1>
      <p>This is the HomePage form. (To be implemented)</p>
      <p>
        Перейти на страницу входа: <Link to={AppRoutes.LOGIN}>Login</Link>
      </p>
      <p>
        Перейти на страницу регистрации: <Link to={AppRoutes.SIGNUP}>SignUp</Link>
      </p>

      <Button sx={{ mr: 3 }} onClick={handleLogout}>
        Выйти
      </Button>
    </div>
  );
};

export { HomePage };
