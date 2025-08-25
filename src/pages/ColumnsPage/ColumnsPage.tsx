// src/pages/ColumnsPage/ColumnsPage.tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  fetchColumn,
  selectAllColumns,
  openEditModal,
  closeEditModal,
  openDeleteModal,
  closeDeleteModal,
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

  const isEditModalOpen = useAppSelector(
    (state) => state.column.isEditModalOpen,
  );
  const isDeleteModalOpen = useAppSelector(
    (state) => state.column.isDeleteModalOpen,
  );
  const selectedColumnId = useAppSelector(
    (state) => state.column.selectedColumnId,
  );
  const selectedColumn = useAppSelector((state: RootState) =>
    selectColumnById(state, selectedColumnId || ""),
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchColumn(userId));
      dispatch(fetchTask(userId)); // Added fetchTask to get tasks for the count
    }
  }, [dispatch, userId]);

  const getTaskCount = (columnId: string) => {
    return allTasks.filter((task) => task.columnId === columnId).length;
  };

  const handleEdit = (columnId: string) => {
    dispatch(openEditModal(columnId));
  };

  const handleDelete = (columnId: string) => {
    dispatch(openDeleteModal(columnId));
  };

  const onConfirmDelete = () => {
    if (selectedColumnId) {
      dispatch(deleteColumn(selectedColumnId));
      dispatch(closeDeleteModal());
    }
  };

  const handleCreateColumn = () => {
    dispatch(openEditModal(null));
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
        {t("columns:myColumns")}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={handleCreateColumn}>
          {t("columns:createColumnButton")}
        </Button>
      </Box>
      <ColumnsTable
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getTaskCount={getTaskCount}
      />

      <Dialog open={isEditModalOpen} onClose={() => dispatch(closeEditModal())}>
        <CreateColumnForm
          onCancel={() => dispatch(closeEditModal())}
          onSuccess={() => dispatch(closeEditModal())}
          userId={userId || ""}
          columnToEdit={selectedColumn || undefined}
        />
      </Dialog>

      <Dialog
        open={isDeleteModalOpen}
        onClose={() => dispatch(closeDeleteModal())}
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
              onClick={() => dispatch(closeDeleteModal())}
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
