import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppRoutes from "@enums/routes";
import { useAppSelector } from "@store/hooks";
import { CircularProgress, Box } from "@mui/material";

const PrivateRoute = () => {
  const navigate = useNavigate();
  const { uid } = useAppSelector((state) => state.userProfile);
  const { isAuthChecked } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthChecked && !uid) {
      navigate(AppRoutes.LOGIN);
    }
  }, [uid, isAuthChecked, navigate]);

  if (!isAuthChecked) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (uid) {
    return <Outlet />;
  }

  return null;
};

export { PrivateRoute };
