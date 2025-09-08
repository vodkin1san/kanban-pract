import { Box, Typography, Alert } from "@mui/material";
import { useAppSelector } from "@store/hooks";
import { CreateColumnForm } from "./CreateColumnForm";
import { ColumnsList } from "@modules/columns/ColumnsList/index";
import { ModalWrapper } from "@modules/columns/ModalWrapper/index";
import { useTranslation } from "react-i18next";
import { selectUserId, selectAuthError } from "@store/selectors";
import { selectAllColumns } from "@store/columnSlice";

const HomePage = () => {
  const userId = useAppSelector(selectUserId);
  const authError = useAppSelector(selectAuthError);
  const columns = useAppSelector(selectAllColumns);
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
            <ModalWrapper openButtonText={t("columns:createColumnButton")}>
              {(onClose) => (
                <CreateColumnForm
                  onCancel={onClose}
                  onSuccess={onClose}
                  userId={userId}
                />
              )}
            </ModalWrapper>
          </Box>
          <ColumnsList userId={userId} columns={columns} />
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
