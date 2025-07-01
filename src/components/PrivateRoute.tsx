import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppRoutes from "../enums/routes.tsx";
import { useAppSelector } from "../store/hooks";

const PrivateRoute = () => {
  const navigate = useNavigate();
  const { uid, isLoading } = useAppSelector((state) => state.user);

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
  }
  return null;
};

export { PrivateRoute };
