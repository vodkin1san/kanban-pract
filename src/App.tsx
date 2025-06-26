import { Routes, Route } from "react-router-dom";
import { ColumnsPage } from "./pages/ColumnsPage";
import { TasksPage } from "./pages/TasksPage";
import { HomePage } from "./pages/HomePage";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import AppRoutesEnum from "./enums/routes";

function App() {
  return (
    <Routes>
      <Route path={AppRoutesEnum.LOGIN} element={<LoginPage />} />
      <Route path={AppRoutesEnum.SIGNUP} element={<SignupPage />} />
      <Route path={AppRoutesEnum.HOME} element={<HomePage />} />
      <Route path={AppRoutesEnum.TASKS} element={<TasksPage />} />
      <Route path={AppRoutesEnum.COLUMNS} element={<ColumnsPage />} />
    </Routes>
  );
}

export { App };
