import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box, Typography } from "@mui/material";
import { createColumn } from "../store/columnSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import columnFormSchema from "../schemas/CreateColumnSchema";

interface CreateColumnFormProps {
  onCancel: () => void;
}

const CreateColumnForm = ({ onCancel }: CreateColumnFormProps) => {
  type CreateColumnFormInputs = z.infer<typeof columnFormSchema>;

  const userId = useAppSelector((state) => state.user.uid);
  const { isLoading } = useAppSelector((state) => state.column);
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
    console.log("Данные формы колонки: ", data);

    if (userId) {
      const resultAction = await dispatch(
        createColumn({ name: data.name, userId: userId }),
      );
      if (createColumn.fulfilled.match(resultAction)) {
        onCancel();
      }
    } else {
      console.error("Пользователь не авторизован. Не могу создать колонку.");
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
          <Button
            type="submit"
            variant="contained"
            disabled={!userId || isLoading}
          >
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
