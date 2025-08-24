// src/components/TasksTable.tsx
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { type FC } from "react";
import { type Task } from "@src/store/tasks/taskTypes";
import { ModalWrapper } from "@modules/columns/ModalWrapper";
import CreateTaskForm from "@pages/HomePage/CreateTaskForm";
import { useTranslation } from "react-i18next";
import { type Column } from "@store/columnSlice";

interface TasksTableProps {
  tasks: Task[];
  columns: Column[];
  userId: string | null;
  onDelete: (taskId: string) => void;
  isDeleteModalOpen: boolean;
  onConfirmDelete: () => void;
  onCloseDeleteModal: () => void;
}

const TasksTable: FC<TasksTableProps> = ({
  tasks,
  columns,
  userId,
  onDelete,
  isDeleteModalOpen,
  onConfirmDelete,
  onCloseDeleteModal,
}) => {
  const { t } = useTranslation(["tasks", "common"]);

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
              const column = columns.find((col) => col.id === task.columnId);
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
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>{column ? column.name : "Без колонки"}</TableCell>
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
                      {userId && task.columnId && (
                        <ModalWrapper
                          openButtonText={
                            <IconButton>
                              <EditIcon />
                            </IconButton>
                          }
                        >
                          {(onClose) => (
                            <CreateTaskForm
                              onCancel={onClose}
                              onSuccess={onClose}
                              userId={userId}
                              columnId={task.columnId!}
                              taskId={task.id}
                            />
                          )}
                        </ModalWrapper>
                      )}
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
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">{t("tasks:confirmDeleteTitle")}</Typography>
          <Typography>{t("tasks:confirmDeleteText")}</Typography>
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button onClick={onCloseDeleteModal} variant="outlined">
              {t("common:cancel")}
            </Button>
            <Button onClick={onConfirmDelete} variant="contained" color="error">
              {t("common:delete")}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export { TasksTable };
