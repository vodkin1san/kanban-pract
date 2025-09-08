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
import { type Column } from "@store/columnSlice";

export interface ColumnCardProps {
  columnId: string;
  userId: string;
  columnName: string;
  columns: Column[];
}

const columnCardStyles: SxProps<Theme> = {
  border: "1px solid #ccc",
  borderRadius: 2,
  p: 2,
  minWidth: 280,
  maxWidth: 320,
  display: "flex",
  flexDirection: "column",
  gap: 1,
};

const taskItemStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  p: 1,
  mb: 1,
  borderRadius: 1,
  boxShadow: 1,
};

const ColumnCard: React.FC<ColumnCardProps> = ({
  columnId,
  userId,
  columnName,
  columns,
}: ColumnCardProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["columns", "common", "tasks"]);
  const tasks = useAppSelector((state: RootState) =>
    selectTasksByColumnId(state, columnId),
  );

  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            ...columnCardStyles,
            backgroundColor: snapshot.isDraggingOver
              ? "rgba(0, 0, 0, 0.1)"
              : "#f4f5f7",
          }}
        >
          <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
            {columnName}
          </Typography>
          <Box sx={{ minHeight: 50, maxHeight: 400, overflowY: "auto" }}>
            {tasks.length > 0 ? (
              tasks.map((task: Task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        ...taskItemStyles,
                        backgroundColor: snapshot.isDragging
                          ? "rgba(255, 255, 255, 0.8)"
                          : "#fff",
                        boxShadow: snapshot.isDragging ? 3 : 1,
                        transform: snapshot.isDragging
                          ? "rotate(2deg)"
                          : "none",
                        border: snapshot.isDragging
                          ? "2px solid #1976d2"
                          : "none",
                        cursor: snapshot.isDragging ? "grabbing" : "grab",
                      }}
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
                              columns={columns}
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
            {provided.placeholder}
          </Box>
          <ModalWrapper openButtonText={t("tasks:addCard")}>
            {(onClose) => (
              <CreateTaskForm
                onCancel={onClose}
                onSuccess={onClose}
                userId={userId}
                columnId={columnId}
                columns={columns}
              />
            )}
          </ModalWrapper>
        </Box>
      )}
    </Droppable>
  );
};

export default ColumnCard;
