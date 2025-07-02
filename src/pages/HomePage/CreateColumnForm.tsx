import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { createColumn } from "@store/columnSlice";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import columnFormSchema from "@schemas/CreateColumnSchema";
import type { CreateColumnFormInputs } from "@schemas/CreateColumnSchema";

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
  const { isLoading, error } = useAppSelector((state) => state.column);
  const dispatch = useAppDispatch();

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
    }
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Создать новую колонку
        </Typography>
        <Box
          noValidate
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Название колонки"
                id="name"
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={isLoading}
              />
            )}
          />
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Создание..." : "Создать"}
          </Button>
          <Button onClick={onCancel} variant="outlined" disabled={isLoading}>
            Отмена
          </Button>
        </Box>
      </Box>
    </>
  );
};

export { CreateColumnForm };
