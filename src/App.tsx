import { Routes, Route } from "react-router-dom";
import { ColumnsPage } from "./pages/ColumnsPage";
import { TasksPage } from "./pages/TasksPage";
import { HomePage } from "./pages/HomePage";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { PrivateRoute } from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/signup" element={<SignupPage />}></Route>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/tasks" element={<TasksPage />}></Route>
        <Route path="/columns" element={<ColumnsPage />}></Route>
      </Route>
    </Routes>
  );
}

export { App };
