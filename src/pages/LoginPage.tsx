import { TextField, Button, Typography, Container, Box, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import AppRoutes from "../enums/routes";
import loginScheme from "../schemas/LoginScheme";
import { getFirebaseErrorMessage } from "../utils/firebaseErrors";

const LoginPage = () => {
  type LoginFormInputs = z.infer<typeof loginScheme>;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginScheme),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      dispatch(setUser({ uid: userCredential.user.uid, email: userCredential.user.email }));
      navigate(AppRoutes.HOME);
    } catch (error) {
      console.error("Ошибка входа", error);
      const errorMessage = getFirebaseErrorMessage(error);
      console.log(`Ошибка: ${errorMessage}`);
    }
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
            Авторизация
          </Typography>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email адрес"
                type="email"
                required
                fullWidth
                margin="normal"
                id="email"
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
                label="Пароль"
                type="password"
                required
                fullWidth
                margin="normal"
                id="password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Войти
          </Button>
          <MuiLink component={RouterLink} to={AppRoutes.SIGNUP}>
            {"Еще нет аккаунта? Зарегистрироваться"}
          </MuiLink>
        </Box>
      </Container>
    </>
  );
};

export { LoginPage };
