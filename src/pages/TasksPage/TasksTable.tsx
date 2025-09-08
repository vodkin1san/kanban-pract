import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { type FC } from "react";
import { type Task } from "@src/store/tasks/taskTypes";
import { useTranslation } from "react-i18next";
import { type Column } from "@store/columnSlice";

interface TasksTableProps {
  tasks: Task[];
  columns: Column[];
  userId: string | null;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  isDeleteModalOpen: boolean;
  onConfirmDelete: () => void;
  onCloseDeleteModal: () => void;
}

const TasksTable: FC<TasksTableProps> = ({
  tasks,
  columns,
  onDelete,
  onEdit,
  isDeleteModalOpen,
  onConfirmDelete,
  onCloseDeleteModal,
}) => {
  const { t } = useTranslation(["tasks", "common"]);

  const getColumnName = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    return column ? column.name : "Без колонки";
  };

  // ✅ Функция для форматирования даты
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    // Простая проверка, чтобы убедиться, что дата валидна
    if (isNaN(date.getTime())) {
      return "Некорректная дата";
    }
    return date.toLocaleDateString();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("tasks:title")}</TableCell>
              <TableCell>{t("tasks:description")}</TableCell>
              <TableCell>{t("tasks:dueDate")}</TableCell>
              <TableCell>{t("tasks:column")}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => {
              return (
                <TableRow
                  key={task.id}
                  sx={{
                    "&:hover .action-buttons": {
                      opacity: 1,
                    },
                  }}
                >
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  {/* ✅ Используем новую функцию formatDate */}
                  <TableCell>{formatDate(task.dueDate)}</TableCell>
                  {/* ✅ Проверяем task.columnId перед вызовом getColumnName */}
                  <TableCell>
                    {task.columnId
                      ? getColumnName(task.columnId)
                      : "Без колонки"}
                  </TableCell>
                  <TableCell>
                    <Box
                      className="action-buttons"
                      sx={{
                        opacity: 0,
                        transition: "opacity 0.2s ease-in-out",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      <IconButton onClick={() => onEdit(task.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => onDelete(task.id)}>
                        <BackspaceIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isDeleteModalOpen} onClose={onCloseDeleteModal}>
        <DialogTitle>{t("tasks:confirmDeleteTitle")}</DialogTitle>
        <DialogContent>
          <Typography>{t("tasks:confirmDeleteText")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDeleteModal}>{t("common:cancel")}</Button>
          <Button onClick={onConfirmDelete} color="error">
            {t("common:delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export { TasksTable };
