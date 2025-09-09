import {
  Box,
  Typography,
  TextField,
  TablePagination,
  CircularProgress,
  Alert,
  Button,
  Dialog,
} from "@mui/material";
import { useEffect, useState, type ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  fetchTask,
  selectAllTasks,
  deleteTask,
} from "@src/store/tasks/taskSlice";
import { selectUserId } from "@store/selectors";
import { fetchColumn, selectAllColumns } from "@store/columnSlice";
import { useTranslation } from "react-i18next";
import { TasksTable } from "@pages/TasksPage/TasksTable";
import CreateTaskForm from "../HomePage/CreateTaskForm";

const TasksPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectUserId);
  const tasks = useAppSelector(selectAllTasks);
  const columns = useAppSelector(selectAllColumns);
  const { loading, error } = useAppSelector((state) => state.tasks.fetch);
  const { t } = useTranslation(["tasks", "common"]);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTask(userId));
      dispatch(fetchColumn(userId));
    }
  }, [dispatch, userId]);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTaskId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedTaskId) {
      dispatch(deleteTask(selectedTaskId));
    }
    setIsDeleteModalOpen(false);
    setSelectedTaskId(null);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const currentTasks = filteredTasks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  if (loading) {
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
        <Typography sx={{ ml: 2 }}>{t("tasks:loadingTasks")}</Typography>
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
      <Typography variant="h4" component="h1" gutterBottom>
        {t("tasks:myTasksTitle")}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setIsCreateModalOpen(true)}>
          {t("tasks:addCard")}
        </Button>
      </Box>
      {userId ? (
        <>
          <Dialog
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          >
            <CreateTaskForm
              columnId={null}
              onCancel={() => setIsCreateModalOpen(false)}
              onSuccess={() => setIsCreateModalOpen(false)}
              userId={userId}
              columns={columns}
            />
          </Dialog>

          <Dialog open={isEditModalOpen} onClose={handleCloseEditModal}>
            <CreateTaskForm
              taskId={selectedTaskId || undefined}
              onCancel={handleCloseEditModal}
              onSuccess={handleCloseEditModal}
              userId={userId}
              columns={columns}
              columnId={null}
            />
          </Dialog>
        </>
      ) : (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {t("auth:notAuthorized")}
        </Alert>
      )}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label={t("tasks:searchPlaceholder")}
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <TasksTable
        tasks={currentTasks}
        columns={columns}
        userId={userId}
        onDelete={handleDeleteClick}
        onEdit={handleEditClick}
        isDeleteModalOpen={isDeleteModalOpen}
        onConfirmDelete={handleConfirmDelete}
        onCloseDeleteModal={() => setIsDeleteModalOpen(false)}
      />

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredTasks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t("common:rowsPerPage")}
      />
    </Box>
  );
};

export { TasksPage };
