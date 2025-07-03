import {
  Box,
  FormControl,
  InputLabel,
  Select,
  AppBar,
  Toolbar,
  Typography,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChanged as firebaseAuthListener } from "firebase/auth";
import { auth } from "@myFirebase/config.ts";
import { useAppDispatch } from "@store/hooks";
import { setUser, clearUser } from "@store/userSlice";
import { ColumnsPage } from "@pages/ColumnsPage";
import { TasksPage } from "@pages/TasksPage";
import { HomePage } from "@pages/HomePage/HomePage.tsx";
import { SignupPage } from "@pages/SignupPage";
import { LoginPage } from "@pages/LoginPage";
import { PrivateRoute } from "@components/PrivateRoute";
import AppRoutes from "@enums/routes";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "./localization/config";

function App() {
  const dispatch = useAppDispatch();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const unsubscribe = firebaseAuthListener(auth, (user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email }));
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t("appName")}
          </Typography>

          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="language-select-label" sx={{ color: "white" }}>
              {t("language")}
            </InputLabel>{" "}
            <Select
              labelId="language-select-label"
              id="language-select"
              value={i18n.language}
              onChange={handleLanguageChange}
              label={t("language")}
              sx={{ color: "white", "& .MuiSelect-icon": { color: "white" } }}
            >
              {supportedLanguages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {t(lang.labelKey)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
