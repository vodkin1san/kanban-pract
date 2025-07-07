import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { createColumn } from "@store/columnSlice";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import columnFormSchema from "@schemas/CreateColumnSchema";
import type { CreateColumnFormInputs } from "@schemas/CreateColumnSchema";
import { useTranslation } from "react-i18next";

export interface CreateColumnFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  userId: string;
}

const CreateColumnForm = ({
  onCancel,
  onSuccess,
  userId,
}: CreateColumnFormProps) => {
  const { isCreatingColumn, error } = useAppSelector((state) => state.column);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["common", "columns"]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateColumnFormInputs>({
    resolver: zodResolver(columnFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateColumnFormInputs) => {
    const resultAction = await dispatch(
      createColumn({ name: data.name, userId: userId }),
    );
    if (createColumn.fulfilled.match(resultAction)) {
      onSuccess();
    } else if (createColumn.rejected.match(resultAction)) {
      console.error(
        "colums:createColumnFailed",
        resultAction.payload || resultAction.error.message,
      );
    }
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {t("columns:columnFormTitle")}
        </Typography>
        <Box
          noValidate
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t("common:error")}: {error}
            </Alert>
          )}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t("columns:columnNameLabel")}
                id="name"
                error={!!errors.name}
                helperText={
                  errors.name?.message ? t(errors.name.message) : undefined
                }
                disabled={isCreatingColumn}
              />
            )}
          />
          <Button type="submit" variant="contained" disabled={isCreatingColumn}>
            {isCreatingColumn
              ? t("common:creating")
              : t("columns:createColumnButton")}
          </Button>
          <Button
            onClick={onCancel}
            variant="outlined"
            disabled={isCreatingColumn}
          >
            {t("common:cancel")}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export { CreateColumnForm };
