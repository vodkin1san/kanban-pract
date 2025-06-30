import { Routes, Route } from "react-router-dom";
import { ColumnsPage } from "./pages/ColumnsPage";
import { TasksPage } from "./pages/TasksPage";
import { HomePage } from "./pages/HomePage";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { PrivateRoute } from "./components/PrivateRoute";
import AppRoutes from "./enums/routes";

function App() {
  return (
    <Routes>
      <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
      <Route path={AppRoutes.SIGNUP} element={<SignupPage />} />
      <Route element={<PrivateRoute />}>
        <Route path={AppRoutes.HOME} element={<HomePage />} />
        <Route path={AppRoutes.TASKS} element={<TasksPage />} />
        <Route path={AppRoutes.COLUMNS} element={<ColumnsPage />} />
      </Route>
    </Routes>
  );
}

export { App };
