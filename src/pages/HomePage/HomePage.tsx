import { useNavigate, Link } from "react-router-dom";
import AppRoutes from "@enums/routes";
import { Button, Alert } from "@mui/material";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import { CreateColumnForm } from "./CreateColumnForm";
import { ColumnsList } from "@modules/columns/ColumnsList/index";
import { logoutUser } from "@store/authSlice";
import { ModalWrapper } from "@modules/columns/ModalWrapper/index";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { uid: userId } = useAppSelector((state) => state.userProfile);
  const { error: authError } = useAppSelector((state) => state.auth);
  const { t } = useTranslation(["common", "auth", "columns"]);

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(resultAction)) {
      navigate(AppRoutes.LOGIN);
    } else if (logoutUser.rejected.match(resultAction)) {
      console.error(
        t(`auth:logoutFailed`),
        resultAction.payload || resultAction.error.message,
      );
    }
  };

  return (
    <div>
      <h1>{t(`mainPageTitle`)}</h1>
      <p>{t(`mainPageDescription`)}</p>
      <p>
        {t(`auth:navToLogin`)}
        <Link to={AppRoutes.LOGIN}>{t(`auth:login`)}</Link>
      </p>
      <p>
        {t(`auth:navToSignUp`)}
        <Link to={AppRoutes.SIGNUP}>{t(`auth:signup`)}</Link>
      </p>
      {authError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {authError}
        </Alert>
      )}

      {userId ? (
        <>
          <ModalWrapper openButtonText={t("columns:createColumnButton")}>
            {(onClose) => (
              <CreateColumnForm
                onCancel={onClose}
                onSuccess={onClose}
                userId={userId}
              />
            )}
          </ModalWrapper>
          <ColumnsList userId={userId} />
          <Button sx={{ mr: 3 }} onClick={handleLogout}>
            {t("auth:logout")}
          </Button>
        </>
      ) : (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {t("auth:notAuthorized")}
        </Alert>
      )}
    </div>
  );
};

export { HomePage };
