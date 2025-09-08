import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  createTask,
  selectTaskById,
  updateTask,
} from "@src/store/tasks/taskSlice";
import createTaskSchema from "@schemas/CreateTaskSchema";
import type { CreateTaskFormInputs } from "@schemas/CreateTaskSchema";
import type { Column } from "@src/store/columnSlice";

export interface CreateTaskFormProps {
  userId: string;
  columnId: string | null;
  onSuccess: () => void;
  onCancel: () => void;
  taskId?: string;
  columns?: Column[];
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  userId,
  columnId,
  onSuccess,
  onCancel,
  taskId,
  columns,
}: CreateTaskFormProps) => {
  const { t } = useTranslation(["common", "tasks"]);
  const dispatch = useAppDispatch();
  const {
    create: { loading: isCreatingTask, error: error },
  } = useAppSelector((state) => state.tasks);
  const taskToEdit = useAppSelector((state) =>
    taskId ? selectTaskById(state, taskId) : undefined,
  );

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<CreateTaskFormInputs>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: taskToEdit?.title || "",
      description: taskToEdit?.description || null,
      dueDate: taskToEdit?.dueDate || null,
      order: taskToEdit?.order || 0,
      columnId: taskId ? taskToEdit?.columnId || null : columnId || null,
    },
  });

  const onSubmit = async (data: CreateTaskFormInputs) => {
    let resultAction;
    if (taskId) {
      resultAction = await dispatch(
        updateTask({
          id: taskId,
          changes: {
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
            order: data.order,
            columnId: data.columnId,
          },
        }),
      );
    } else {
      resultAction = await dispatch(
        createTask({
          userId,
          columnId: data.columnId,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          order: data.order,
        }),
      );
    }
    if (
      updateTask.fulfilled.match(resultAction) ||
      createTask.fulfilled.match(resultAction)
    ) {
      onSuccess();
    } else if (
      updateTask.rejected.match(resultAction) ||
      createTask.rejected.match(resultAction)
    ) {
      console.error(
        "tasks:createTaskFailed",
        resultAction.payload || resultAction.error.message,
      );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        {taskId ? t("tasks:editTastTitle") : t("tasks:createTaskTitle")}
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
          name="columnId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.columnId}>
              <InputLabel>{t("tasks:columnLabel")}</InputLabel>
              <Select
                {...field}
                label={t("tasks:columnLabel")}
                disabled={isCreatingTask || !columns?.length}
                value={field.value || ""}
              >
                <MenuItem value="">
                  <em>{t("tasks:noColumn")}</em>
                </MenuItem>
                {columns?.map((column) => (
                  <MenuItem key={column.id} value={column.id}>
                    {column.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.columnId && (
                <Typography color="error" variant="caption">
                  {t(`tasks:validation.${errors.columnId.message}`)}
                </Typography>
              )}
            </FormControl>
          )}
        />
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label={t("tasks:taskTitleLabel")}
              id="title"
              error={!!errors.title}
              helperText={
                errors.title?.message
                  ? t(`tasks:validation.${errors.title.message}`)
                  : undefined
              }
              disabled={isCreatingTask}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label={t("tasks:taskDescriptionLabel")}
              id="description"
              multiline
              rows={3}
              value={field.value || ""}
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={isCreatingTask}
            />
          )}
        />
        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label={t("tasks:taskDueDateLabel")}
              id="dueDate"
              type="date"
              value={field.value || ""}
              error={!!errors.dueDate}
              helperText={
                errors.dueDate?.message
                  ? t(`tasks:validation.${errors.dueDate.message}`)
                  : undefined
              }
              disabled={isCreatingTask}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          )}
        />
        <Controller
          name="order"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label={t("tasks:taskOrderLabel")}
              id="order"
              type="number"
              onChange={(e) => field.onChange(Number(e.target.value))}
              error={!!errors.order}
              helperText={
                errors.order?.message
                  ? t(`tasks:validation.${errors.order.message}`)
                  : undefined
              }
              disabled={isCreatingTask}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isCreatingTask || !isValid}
        >
          {isCreatingTask ? (
            <CircularProgress size={24} />
          ) : taskId ? (
            t("tasks:editTaskButton")
          ) : (
            t("tasks:createTaskButton")
          )}
        </Button>
        <Button onClick={onCancel} variant="outlined" disabled={isCreatingTask}>
          {t("common:cancel")}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateTaskForm;
