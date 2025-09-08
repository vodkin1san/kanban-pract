import { useEffect } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { fetchColumn, selectAllColumns } from "@store/columnSlice";
import { fetchTask } from "@src/store/tasks/taskSlice";
import {
  updateTaskColumn,
  reorderTaskInColumn,
} from "@src/store/tasks/taskThunks";
import { useTranslation } from "react-i18next";
import ColumnCard from "./ColumnCard";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { type Column } from "@store/columnSlice";

export interface ColumnsListProps {
  userId: string;
  columns: Column[];
}

const ColumnsList: React.FC<ColumnsListProps> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectAllColumns);
  const isFetchingColumns = useAppSelector(
    (state) => state.column.isFetchingColumns,
  );
  const error = useAppSelector((state) => state.column.error);
  const { t } = useTranslation(["columns", "common"]);

  useEffect(() => {
    dispatch(fetchColumn(userId));
    dispatch(fetchTask(userId));
  }, [dispatch, userId]);

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

  const onDragEnd = (result: DropResult<string>) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      dispatch(
        reorderTaskInColumn({
          taskId: draggableId,
          newIndex: destination.index,
        }),
      );
    } else {
      dispatch(
        updateTaskColumn({
          taskId: draggableId,
          newColumnId: destination.droppableId,
          newIndex: destination.index,
        }),
      );
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {t("columns:myColumnsTitle")}
        </Typography>
        {columns.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              gap: 3,
              p: 3,
              overflowX: "auto",
              alignItems: "flex-start",
            }}
          >
            {columns.map((column) => (
              <ColumnCard
                key={column.id}
                columnId={column.id}
                columnName={column.name}
                userId={userId}
                columns={columns}
              />
            ))}
          </Box>
        ) : (
          <Typography>{t("columns:noColumnsYet")}</Typography>
        )}
      </Box>
    </DragDropContext>
  );
};

export { ColumnsList };
