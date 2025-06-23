import { Link as MuiLink, Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { useDispatch } from "react-redux";
import { clearUser } from "../store/userSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      navigator("/login");
    } catch (error) {
      console.error("Выход не удался: ", error);
    }
  };

  return (
    <>
      <MuiLink sx={{ mr: 3 }} component={RouterLink} to={"/signup"} variant="body2">
        {"На тест поля singup"}
      </MuiLink>

      <MuiLink sx={{ mr: 3 }} component={RouterLink} to={"/login"} variant="body2">
        {"На тест поля login"}
      </MuiLink>

      <Button onClick={handleLogout}>Выйти</Button>
    </>
  );
};

export { HomePage };
