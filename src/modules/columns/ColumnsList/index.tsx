import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { fetchColumn, selectAllColumns } from "@store/columnSlice";
import { useTranslation } from "react-i18next";

export interface ColumnsListProps {
  userId: string;
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
  }, [dispatch, userId]);

  if (isFetchingColumns) {
    return <p>{t("loadingColumns")}</p>;
  }

  if (error) {
    return (
      <p style={{ color: "red" }}>
        {t("error")}: {error}
      </p>
    );
  }

  return (
    <Box>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        {t("myColumnsTitle")}
      </Typography>
      {columns.length > 0 ? (
        <ul>
          {columns.map((column) => (
            <li key={column.id}>
              {column.name} (ID: {column.id})
            </li>
          ))}
        </ul>
      ) : (
        <Typography>{t("noColumnsYet")}</Typography>
      )}
    </Box>
  );
};

export { ColumnsList };
