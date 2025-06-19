import { Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const HomePage = () => {
  return (
    <MuiLink component={RouterLink} to={"/signup"} variant="body2">
      {"На тест поля регистрации"}
    </MuiLink>
  );
};

export { HomePage };
