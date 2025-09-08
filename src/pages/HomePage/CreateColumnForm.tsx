import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Chip,
  Autocomplete,
} from "@mui/material";
import { createColumn, updateColumn, type Column } from "@store/columnSlice";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import columnFormSchema from "@schemas/CreateColumnSchema";
import type { CreateColumnFormInputs } from "@schemas/CreateColumnSchema";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { selectAllTasks, updateTask } from "@src/store/tasks/taskSlice";
import type { Task } from "@src/store/tasks/taskTypes";

export interface CreateColumnFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  userId: string;
  columnToEdit?: Column;
}

const CreateColumnForm = ({
  onCancel,
  onSuccess,
  userId,
  columnToEdit,
}: CreateColumnFormProps) => {
  const { isCreatingColumn, error } = useAppSelector((state) => state.column);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["common", "columns"]);

  const allTasks = useAppSelector(selectAllTasks);
  const unassignedTasks = allTasks.filter((task) => !task.columnId);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateColumnFormInputs>({
    resolver: zodResolver(columnFormSchema),
    defaultValues: {
      name: "",
      taskIds: [],
    },
  });

  useEffect(() => {
    if (columnToEdit) {
      reset({ name: columnToEdit.name, taskIds: [] });
    } else {
      reset({ name: "", taskIds: [] });
    }
  }, [columnToEdit, reset]);

  const onSubmit = async (data: CreateColumnFormInputs) => {
    let newColumnId: string | undefined;

    if (columnToEdit) {
      const resultAction = await dispatch(
        updateColumn({ id: columnToEdit.id, changes: { name: data.name } }),
      );
      if (updateColumn.fulfilled.match(resultAction)) {
        newColumnId = columnToEdit.id;
      } else if (updateColumn.rejected.match(resultAction)) {
        console.error(
          "Failed to update column:",
          resultAction.payload || resultAction.error.message,
        );
        return;
      }
    } else {
      const resultAction = await dispatch(
        createColumn({ name: data.name, userId: userId }),
      );
      if (createColumn.fulfilled.match(resultAction)) {
        newColumnId = resultAction.payload.id;
      } else if (createColumn.rejected.match(resultAction)) {
        console.error(
          "Failed to create column:",
          resultAction.payload || resultAction.error.message,
        );
        return;
      }
    }

    if (newColumnId && data.taskIds?.length) {
      const taskUpdates = data.taskIds.map((taskId) =>
        dispatch(
          updateTask({
            id: taskId,
            changes: { columnId: newColumnId, order: 0 },
          }),
        ),
      );
      await Promise.all(taskUpdates);
    }

    onSuccess();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        {columnToEdit
          ? t("columns:editColumnTitle")
          : t("columns:columnFormTitle")}
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
                errors.name?.message
                  ? t(`columns:validation.${errors.name.message}`)
                  : undefined
              }
              disabled={isCreatingColumn}
            />
          )}
        />
        <Controller
          name="taskIds"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              options={unassignedTasks}
              getOptionLabel={(option) => option.title}
              value={(field.value ?? [])
                .map((id: string) =>
                  unassignedTasks.find((task) => task.id === id),
                )
                .filter((task): task is Task => Boolean(task))}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_event, newValue) => {
                const newIds = newValue.map((task) => task.id);
                field.onChange(newIds);
              }}
              noOptionsText={t("tasks:noUnassignedTasks")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("tasks:addTasksLabel")}
                  placeholder={t("tasks:addTasksPlaceholder")}
                  error={!!errors.taskIds}
                  helperText={
                    errors.taskIds?.message
                      ? t(errors.taskIds.message)
                      : undefined
                  }
                />
              )}
              renderValue={(selected, getTagProps) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((task, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return <Chip key={key} label={task.title} {...tagProps} />;
                  })}
                </Box>
              )}
            />
          )}
        />
        <Button type="submit" variant="contained" disabled={isCreatingColumn}>
          {isCreatingColumn
            ? t("common:creating")
            : columnToEdit
              ? t("columns:updateColumnButton")
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
  );
};

export { CreateColumnForm };
