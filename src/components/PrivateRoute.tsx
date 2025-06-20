import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged as firebaseAuthListener } from "firebase/auth";
import { auth } from "../firebase/config.ts";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = firebaseAuthListener(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate("/login");
      }

      setIsLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return isAuthenticated ? <Outlet /> : null;
};

export { PrivateRoute };
