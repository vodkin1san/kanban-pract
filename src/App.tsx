import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  onAuthStateChanged as firebaseAuthListener,
  signOut,
} from "firebase/auth";
import { auth } from "@myFirebase/config.ts";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setUser, clearUser } from "@store/userProfileSlice";
import { setAuthChecked } from "@store/authSlice";
import { ColumnsPage } from "@src/pages/ColumnsPage/ColumnsPage";
import { TasksPage } from "@src/pages/TasksPage/TasksPage";
import { HomePage } from "@pages/HomePage/HomePage.tsx";
import { SignupPage } from "@pages/SignupPage";
import { LoginPage } from "@pages/LoginPage";
import { PrivateRoute } from "@components/PrivateRoute";
import AppRoutes from "@enums/routes";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@components/LanguageSwitcher";
import { selectUserId } from "@store/selectors";

function App() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const userId = useAppSelector(selectUserId);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = firebaseAuthListener(auth, (user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email }));
      } else {
        dispatch(clearUser());
      }
      dispatch(setAuthChecked(true));
    });
    return () => unsubscribe();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate(AppRoutes.LOGIN);
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              component={Link}
              to={AppRoutes.HOME}
              sx={{ textDecoration: "none", color: "inherit", mr: 4 }}
            >
              {t("appName")}
            </Typography>
            {userId && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button component={Link} to={AppRoutes.COLUMNS} color="inherit">
                  {t("columns:columns")}
                </Button>
                <Button component={Link} to={AppRoutes.TASKS} color="inherit">
                  {t("tasks:tasks")}
                </Button>
              </Box>
            )}
          </Box>
          <LanguageSwitcher sx={{ ml: 1 }} />
          {userId && (
            <Button
              onClick={handleLogout}
              variant="contained"
              color="error"
              sx={{ ml: 2 }}
            >
              {t("auth:logout")}
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
        <Route path={AppRoutes.SIGNUP} element={<SignupPage />} />
        <Route element={<PrivateRoute />}>
          <Route path={AppRoutes.HOME} element={<HomePage />} />
          <Route path={AppRoutes.TASKS} element={<TasksPage />} />
          <Route path={AppRoutes.COLUMNS} element={<ColumnsPage />} />
        </Route>
      </Routes>
    </Box>
  );
}

export { App };
