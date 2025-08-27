import {
  Typography,
  Box,
  type SxProps,
  type Theme,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { useTranslation } from "react-i18next";
import { ModalWrapper } from "@modules/columns/ModalWrapper";
import CreateTaskForm from "@pages/HomePage/CreateTaskForm";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { deleteTask, selectTasksByColumnId } from "@src/store/tasks/taskSlice";
import { type RootState } from "@store/index";
import { type Task } from "@src/store/tasks/taskTypes";
import { Draggable, Droppable } from "@hello-pangea/dnd";

export interface ColumnCardProps {
  columnId: string;
  userId: string;
  columnName: string;
}

const columnCardStyles: SxProps<Theme> = {
  border: "1px solid #ccc",
  borderRadius: 2,
  p: 2,
  minWidth: 280,
  maxWidth: 320,
  backgroundColor: "#f4f5f7",
  display: "flex",
  flexDirection: "column",
  gap: 1,
};

const taskItemStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  p: 1,
  mb: 1,
  backgroundColor: "#fff",
  borderRadius: 1,
  boxShadow: 1,
};

const ColumnCard: React.FC<ColumnCardProps> = ({
  columnId,
  userId,
  columnName,
}: ColumnCardProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["columns", "common", "tasks"]);
  const tasks = useAppSelector((state: RootState) =>
    selectTasksByColumnId(state, columnId),
  );

  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={columnCardStyles}
        >
          <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
            {columnName}
          </Typography>
          <Box sx={{ minHeight: 50, maxHeight: 400, overflowY: "auto" }}>
            {tasks.length > 0 ? (
              tasks.map((task: Task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={taskItemStyles}
                    >
                      <Typography
                        style={{ display: "flex", alignItems: "center" }}
                        variant="body1"
                      >
                        {task.title}
                      </Typography>
                      <Box
                        sx={{
                          opacity: "0",
                          transition: "opacity 0.2s ease-in-out",
                          "&:hover": { opacity: "1" },
                        }}
                      >
                        <ModalWrapper openButtonIcon={<EditIcon />}>
                          {(onClose) => (
                            <CreateTaskForm
                              onCancel={onClose}
                              onSuccess={onClose}
                              userId={userId}
                              columnId={columnId}
                              taskId={task.id}
                            />
                          )}
                        </ModalWrapper>

                        <IconButton
                          onClick={() => dispatch(deleteTask(task.id))}
                        >
                          <BackspaceIcon></BackspaceIcon>
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </Draggable>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t("tasks:noTasksYet")}
              </Typography>
            )}
          </Box>
          <ModalWrapper openButtonText={t("tasks:addCard")}>
            {(onClose) => (
              <CreateTaskForm
                onCancel={onClose}
                onSuccess={onClose}
                userId={userId}
                columnId={columnId}
              />
            )}
          </ModalWrapper>
        </Box>
      )}
    </Droppable>
  );
};

export default ColumnCard;
