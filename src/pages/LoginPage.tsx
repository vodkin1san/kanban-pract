import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Link as MuiLink,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { loginUser } from "@store/userSlice";
import AppRoutes from "@enums/routes";
import loginSchema from "@schemas/LoginSchema";
import type { LoginFormInputs } from "@schemas/LoginSchema";

const LoginPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.user);

  const onSubmit = async (data: LoginFormInputs) => {
    const resultAction = await dispatch(
      loginUser({ email: data.email, password: data.password }),
    );
    if (loginUser.fulfilled.match(resultAction)) {
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
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Typography component="h1" variant="h5">
            Авторизация
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
                type="email"
                label="Email адрес"
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
                type="password"
                label="Пароль"
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
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
            {isLoading ? "Вход..." : "Войти"}
          </Button>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              Ошибка: {error}
            </Typography>
          )}
          <MuiLink component={RouterLink} to={AppRoutes.SIGNUP}>
            {"Еще нет аккаунта? Зарегистрироваться"}
          </MuiLink>
        </Box>
      </Container>
    </>
  );
};

export { LoginPage };
