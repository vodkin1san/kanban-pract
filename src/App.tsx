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

function App() {
  const dispatch = useAppDispatch();

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
