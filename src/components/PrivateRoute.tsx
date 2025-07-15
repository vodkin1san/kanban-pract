import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppRoutes from "@enums/routes";
import { useAppSelector } from "@store/hooks";
import { CircularProgress, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const PrivateRoute = () => {
  const navigate = useNavigate();
  const { uid, isAuthChecked } = useAppSelector((state) => state.user);
  const { t } = useTranslation(["common"]);

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
        <div>{t(`common:loginLoading`)}</div>
      </Box>
    );
  }

  if (uid) {
    return <Outlet />;
  }
  return null;
};

export { PrivateRoute };
