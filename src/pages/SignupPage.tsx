import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Typography, Container, Box, Link as MuiLink } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { registerUser } from "../store/userSlice";
import AppRoutes from "../enums/routes";
import signupScheme from "../schemas/SignupScheme";
import type { SignupFormInputs } from "../schemas/SignupScheme";

const SignupPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupScheme),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.user);

  const onSubmit = async (data: SignupFormInputs) => {
    const resultAction = await dispatch(
      registerUser({ email: data.email, password: data.password })
    );
    if (registerUser.fulfilled.match(resultAction)) {
      navigate(AppRoutes.HOME);
    }
  };
  return (
    <>
      <Container maxWidth="xs">
        <Box
          noValidate
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 8 }}
        >
          <Typography component="h1" variant="h5">
            Регистрация
          </Typography>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                id="email"
                label="Email адрес"
                type="email"
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                id="password"
                label="Пароль"
                type="password"
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                fullWidth
                id="confirmPassword"
                label="Повторите пароль"
                type="password"
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            )}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              Ошибка: {error}
            </Typography>
          )}
          <MuiLink component={RouterLink} to={AppRoutes.LOGIN} variant="body2">
            {"Уже есть аккаунт? Войти"}
          </MuiLink>
        </Box>
      </Container>
    </>
  );
};

export { SignupPage };
