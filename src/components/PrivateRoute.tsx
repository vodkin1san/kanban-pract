import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged as firebaseAuthListener } from "firebase/auth";
import { auth } from "../firebase/config.ts";
import AppRoutes from "../enums/routes.tsx";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser, clearUser } from "../store/userSlice";

const PrivateRoute = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { uid, isLoading } = useAppSelector((state) => state.user);

  useEffect(() => {
    const unsubscribe = firebaseAuthListener(auth, (user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email }));
      } else {
        dispatch(clearUser());
      }
    });
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && !uid) {
      navigate(AppRoutes.LOGIN);
    }
  }, [uid, isLoading, navigate]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (uid) {
    return <Outlet />;
  } else {
    return null;
  }
};

export { PrivateRoute };
