import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Typography, Container, Box, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import AppRoutes from "../enums/routes";
import signupSchem from "../schemas/SignupSchem";
import { getFirebaseErrorMessage } from "../utils/firebaseErrors";

const SignupPage = () => {
  type SignupFormInputs = z.infer<typeof signupSchem>;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchem),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data: SignupFormInputs) => {
    console.log(data);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      console.log("Пользователь успешно зарегистрировался!", userCredential.user);
      dispatch(setUser({ uid: userCredential.user.uid, email: userCredential.user.email }));
      navigate(AppRoutes.HOME);
    } catch (error) {
      console.error("Ошибка регистрации", error);
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
            Регистрация
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
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Повторите пароль"
                type="password"
                required
                fullWidth
                margin="normal"
                id="confirmPassword"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            )}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Зарегистрироваться
          </Button>
          <MuiLink component={RouterLink} to={AppRoutes.LOGIN} variant="body2">
            {"Уже есть аккаунт? Войти"}
          </MuiLink>
        </Box>
      </Container>
    </>
  );
};

export { SignupPage };
