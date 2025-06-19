import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Typography, Container, Box, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
// useNavigate

const mySchem = z
  .object({
    email: z.string().email("Укажите ваш email адрес"),
    password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
    confirmPassword: z.string().min(6, "Пароль должен быть не менее 6 символов"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совподают",
    path: ["confirmPassword"],
  });

const SignupPage = () => {
  type SignupFormInputs = z.infer<typeof mySchem>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(mySchem),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    // mode: "onBlur",
  });

  const onSubmit = (data: SignupFormInputs) => {
    console.log(data);
  };
  return (
    <>
      <Container maxWidth="xs">
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 8 }}
        >
          <Typography component="h1" variant="h5">
            Регистрация
          </Typography>
          <TextField
            label="Email адрес"
            type="email"
            required
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          ></TextField>
          <TextField
            label="Пароль"
            type="password"
            required
            fullWidth
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          ></TextField>
          <TextField
            label="Повторите пароль"
            type="password"
            required
            fullWidth
            margin="normal"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          ></TextField>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Зарегистрироваться
          </Button>
          <MuiLink component={RouterLink} to={"/login"} variant="body2">
            {"Уже есть аккаунт? Войти"}
          </MuiLink>
        </Box>
      </Container>
    </>
  );
};

export { SignupPage };
