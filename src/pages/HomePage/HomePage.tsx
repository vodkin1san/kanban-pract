import { Box, Typography, Alert, Button } from "@mui/material";
import { useAppSelector } from "@store/hooks";
import { CreateColumnForm } from "./CreateColumnForm";
import { ColumnsList } from "@modules/columns/ColumnsList/index";
import { ModalWrapper } from "@modules/columns/ModalWrapper/index";
import { useTranslation } from "react-i18next";
import { selectUserId, selectAuthError } from "@store/selectors";

const HomePage = () => {
  const userId = useAppSelector(selectUserId);
  const authError = useAppSelector(selectAuthError);
  const { t } = useTranslation(["common", "auth", "columns"]);

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      {authError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {authError}
        </Alert>
      )}

      {userId ? (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {t("columns:myBoardTitle")}
            </Typography>
            <ModalWrapper
              openButtonText={
                <Button variant="contained" color="primary">
                  {t("columns:createColumnButton")}
                </Button>
              }
            >
              {(onClose) => (
                <CreateColumnForm
                  onCancel={onClose}
                  onSuccess={onClose}
                  userId={userId}
                />
              )}
            </ModalWrapper>
          </Box>
          <ColumnsList userId={userId} />
        </>
      ) : (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {t("auth:notAuthorized")}
        </Alert>
      )}
    </Box>
  );
};

export { HomePage };
