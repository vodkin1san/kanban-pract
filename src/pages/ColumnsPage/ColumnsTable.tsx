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
  TextField,
  TablePagination,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { type FC, useState, type ChangeEvent, useEffect } from "react";
import { type Column } from "@store/columnSlice";
import { useTranslation } from "react-i18next";

interface ColumnsTableProps {
  columns: Column[];
  onEdit: (columnId: string) => void;
  onDelete: (columnId: string) => void;
  getTaskCount: (columnId: string) => number;
}

const ColumnsTable: FC<ColumnsTableProps> = ({
  columns,
  onEdit,
  onDelete,
  getTaskCount,
}) => {
  const { t } = useTranslation(["columns", "common"]);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const filteredColumns = columns.filter((column) =>
    column.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  );

  const paginatedColumns = filteredColumns.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

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

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label={t("columns:searchPlaceholder")}
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("columns:columnNameLabel")}</TableCell>
              <TableCell>{t("columns:createdAt")}</TableCell>
              <TableCell>{t("columns:taskCount")}</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedColumns.length > 0 ? (
              paginatedColumns.map((column) => (
                <TableRow key={column.id}>
                  <TableCell>{column.name}</TableCell>
                  <TableCell>
                    {new Date(column.createAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getTaskCount(column.id)}</TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        opacity: "0",
                        "&:hover": { opacity: "1" },
                        transition: "opacity 0.2s ease-in-out",
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
                  <Typography variant="subtitle1" color="text.secondary">
                    {t("columns:noColumnsFound")}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredColumns.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t("common:rowsPerPage")}
      />
    </>
  );
};

export { ColumnsTable };
