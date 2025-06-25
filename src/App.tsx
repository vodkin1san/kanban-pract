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
      <Route path={AppRoutesEnum.LOGIN} element={<LoginPage />}></Route>
      <Route path={AppRoutesEnum.SIGNUP} element={<SignupPage />}></Route>
      <Route path={AppRoutesEnum.HOME} element={<HomePage />}></Route>
      <Route path={AppRoutesEnum.TASKS} element={<TasksPage />}></Route>
      <Route path={AppRoutesEnum.COLUMNS} element={<ColumnsPage />}></Route>
    </Routes>
  );
}

export { App };
