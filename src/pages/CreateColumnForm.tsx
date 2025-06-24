import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box, Typography } from "@mui/material";

import { createColumn } from "../store/columnSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import columnFormSchem from "../schemas/CreateColumnFormSchem";

interface CreateColumnFormProps {
  onCancel: () => void;
}

const CreateColumnForm = ({ onCancel }: CreateColumnFormProps) => {
  type CreateColumnFormInputs = z.infer<typeof columnFormSchem>;

  const userId = useAppSelector((state) => state.user.uid);

  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateColumnFormInputs>({
    resolver: zodResolver(columnFormSchem),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: CreateColumnFormInputs) => {
    console.log("Данные формы колонки: ", data);

    if (userId) {
      dispatch(createColumn({ name: data.name, userId: userId }));
      onCancel();
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
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Название колонки"
                fullWidth
                id="name"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Button type="submit" variant="contained" disabled={!userId}>
            Создать
          </Button>
          <Button onClick={onCancel} variant="outlined">
            Отмена
          </Button>
        </Box>
      </Box>
    </>
  );
};

export { CreateColumnForm };
