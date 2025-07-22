import { Typography, Box, type SxProps, type Theme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ModalWrapper } from "@modules/columns/ModalWrapper";
import CreateTaskForm from "@pages/HomePage/CreateTaskForm";
import { useAppSelector } from "@store/hooks";
import { selectTasksByColumnId } from "@src/store/tasks/taskSlice";
import { type RootState } from "@store/index";
import { type Task } from "@src/store/tasks/taskTypes";

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
  const { t } = useTranslation(["columns", "common", "tasks"]);
  const tasks = useAppSelector((state: RootState) =>
    selectTasksByColumnId(state, columnId),
  );

  return (
    <Box sx={columnCardStyles}>
      <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
        {columnName}
      </Typography>
      <Box sx={{ minHeight: 50, maxHeight: 400, overflowY: "auto" }}>
        {tasks.length > 0 ? (
          tasks.map((task: Task) => (
            <Box key={task.id} sx={taskItemStyles}>
              <Typography variant="body1">{task.title}</Typography>
            </Box>
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
  );
};

export default ColumnCard;
