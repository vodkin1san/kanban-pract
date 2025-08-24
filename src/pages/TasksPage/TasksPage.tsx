import {
  Box,
  Typography,
  TextField,
  TablePagination,
  CircularProgress,
  Alert,
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

const TasksPage = () => {
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

  const handleDeleteClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsDeleteModalOpen(true);
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
      />
    </Box>
  );
};

export { TasksPage };
