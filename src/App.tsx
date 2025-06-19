import { Routes, Route } from "react-router-dom";
import { ColumnsPage } from "./ColumnsPage";
import { TasksPage } from "./TasksPage";
import { HomePage } from "./HomePage";
import { SignupPage } from "./SignupPage";
import { LoginPage } from "./LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage></LoginPage>}></Route>
      <Route path="/signup" element={<SignupPage></SignupPage>}></Route>
      <Route path="/" element={<HomePage></HomePage>}></Route>
      <Route path="/tasks" element={<TasksPage></TasksPage>}></Route>
      <Route path="/columns" element={<ColumnsPage></ColumnsPage>}></Route>
    </Routes>
  );
}

export { App };
