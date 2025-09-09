import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  fetchColumn,
  selectAllColumns,
  deleteColumn,
  selectColumnById,
} from "@store/columnSlice";
import { fetchTask, selectAllTasks } from "@src/store/tasks/taskSlice";
import { selectUserId } from "@store/selectors";
import {
  Box,
  Typography,
  Button,
  Dialog,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ColumnsTable } from "./ColumnsTable";
import { useTranslation } from "react-i18next";
import { CreateColumnForm } from "@pages/HomePage/CreateColumnForm";
import type { RootState } from "@store/index";
import { ModalWrapper } from "@modules/columns/ModalWrapper";

function ColumnsPage() {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectAllColumns);
  const allTasks = useAppSelector(selectAllTasks);
  const userId = useAppSelector(selectUserId);
  const isFetchingColumns = useAppSelector(
    (state) => state.column.isFetchingColumns,
  );
  const error = useAppSelector((state) => state.column.error);
  const { t } = useTranslation(["common", "columns"]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);

  const selectedColumn = useAppSelector((state: RootState) =>
    selectedColumnId ? selectColumnById(state, selectedColumnId) : undefined,
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchColumn(userId));
      dispatch(fetchTask(userId));
    }
  }, [dispatch, userId]);

  const getTaskCount = (columnId: string) => {
    return allTasks.filter((task) => task.columnId === columnId).length;
  };

  const handleEdit = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsEditModalOpen(true);
  };

  const handleDelete = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = () => {
    if (selectedColumnId) {
      dispatch(deleteColumn(selectedColumnId));
      setIsDeleteModalOpen(false);
      setSelectedColumnId(null);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedColumnId(null);
  };

  if (isFetchingColumns) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>{t("columns:loadingColumns")}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {t("common:error")}: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("columns:myColumnsTitle")}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <ModalWrapper openButtonText={t("columns:createColumnButton")}>
          {(onClose) => (
            <CreateColumnForm
              onCancel={onClose}
              onSuccess={onClose}
              userId={userId || ""}
            />
          )}
        </ModalWrapper>
      </Box>
      <ColumnsTable
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getTaskCount={getTaskCount}
      />

      {isEditModalOpen && selectedColumn && (
        <ModalWrapper openInitially={true} onClose={handleCloseEditModal}>
          {(onClose) => (
            <CreateColumnForm
              onCancel={onClose}
              onSuccess={onClose}
              userId={userId || ""}
              columnToEdit={selectedColumn}
            />
          )}
        </ModalWrapper>
      )}

      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">
            {t("columns:confirmDeleteTitle")}
          </Typography>
          <Typography>{t("columns:confirmDeleteText")}</Typography>
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              onClick={() => setIsDeleteModalOpen(false)}
              variant="outlined"
            >
              {t("common:cancel")}
            </Button>
            <Button onClick={onConfirmDelete} variant="contained" color="error">
              {t("common:delete")}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

export { ColumnsPage };
