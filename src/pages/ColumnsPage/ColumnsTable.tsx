import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { type FC } from "react";
import { type Column } from "@store/columnSlice";
import { useTranslation } from "react-i18next";

interface ColumnsTableProps {
  columns: Column[];
  onEdit: (columnId: string) => void;
  onDelete: (columnId: string) => void;
}

const ColumnsTable: FC<ColumnsTableProps> = ({ columns, onEdit, onDelete }) => {
  const { t } = useTranslation(["columns", "common"]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("columns:columnNameLabel")}</TableCell>
              <TableCell>{t("columns:createdAt")}</TableCell>
              <TableCell>{t("columns:taskCount")}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {columns.length > 0 ? (
              columns.map((column) => (
                <TableRow key={column.id}>
                  <TableCell>{column.name}</TableCell>
                  <TableCell>
                    {new Date(column.createAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>TODO: COUNT</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      <IconButton onClick={() => onEdit(column.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => onDelete(column.id)}>
                        <BackspaceIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {t("columns:noColumnsFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export { ColumnsTable };
