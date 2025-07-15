import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { createTask } from "@store/taskSlice";
import createTaskSchema from "@schemas/CreateTaskSchema";
import type { CreateTaskFormInputs } from "@schemas/CreateTaskSchema";

export interface CreateTaskFormProps {
  userId: string;
  columnId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateTaskFormProps: React.FC<CreateTaskFormProps> = ({
  userId,
  columnId,
  onSuccess,
  onCancel,
}: CreateTaskFormProps) => {
  const { t } = useTranslation(["common", "tasks"]);
  const dispatch = useAppDispatch();
  const { isCreatingTask, error } = useAppSelector((state) => state.tasks);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateTaskFormInputs>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: null,
      dueDate: null,
      order: 0,
    },
  });

  const onSubmit = async (data: CreateTaskFormInputs) => {
    const resultAction = await dispatch(
      createTask({
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        order: data.order,
        userId,
        columnId,
      }),
    );
    if (createTask.fulfilled.match(resultAction)) {
      onSuccess();
    } else if (createTask.rejected.match(resultAction)) {
      console.error(
        "tasks:createTaskFailed",
        resultAction.payload || resultAction.error.message,
      );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        {t("tasks:createTaskTitle")}
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
        <Button type="submit" variant="contained" disabled={isCreatingTask}>
          {isCreatingTask ? (
            <CircularProgress size={24} />
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

export default CreateTaskFormProps;
