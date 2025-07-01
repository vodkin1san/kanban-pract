import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchColumn, selectAllColumns } from "../../../store/columnSlice";

export interface ColumnsListProps {
  userId: string;
}

const ColumnsList: React.FC<ColumnsListProps> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectAllColumns);
  const isLoading = useAppSelector((state) => state.column.isLoading);
  const error = useAppSelector((state) => state.column.error);

  useEffect(() => {
    dispatch(fetchColumn(userId));
  }, [dispatch, userId]);

  if (isLoading) {
    return <p>Загрузка колонок...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Ошибка: {error}</p>;
  }

  return (
    <Box>
      <h2>Мои Колонки:</h2>
      {columns.length > 0 ? (
        <ul>
          {columns.map((column) => (
            <li key={column.id}>
              {column.name} (ID: {column.id})
            </li>
          ))}
        </ul>
      ) : (
        <p>У вас пока нет колонок. Создайте новую!</p>
      )}
    </Box>
  );
};

export { ColumnsList };
