import { TextField, Button, Typography, Container, Box, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const mySchem = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(1, "Пожалуйста, введите пароль"),
});

const LoginPage = () => {
  type LoginFormInputs = z.infer<typeof mySchem>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(mySchem),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    console.log(data);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log("Пользователь вошёл: ", userCredential.user);
      navigate("/");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Ошибка входа", error.code, error.message);
      let errorMessage = "Произошла ошибка входа, попробуйте повторить попытку!";
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-login-credentials":
          errorMessage = "Неверный email или пароль.";
          break;
        case "auth/invalid-email":
          errorMessage = "Неверный формат email.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Ошибка сети. Проверьте ваше подключение к интернету.";
          break;
        default:
          errorMessage = "Произошла непредвиденная ошибка при входе. Пожалуйста, попробуйте снова.";
          break;
      }
      alert(`Ошибка: ${errorMessage}`);
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
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Войти
          </Button>
          <MuiLink component={RouterLink} to={"/signup"}>
            {"Еще нет аккаунта? Зарегистрироваться"}
          </MuiLink>
        </Box>
      </Container>
    </>
  );
};

export { LoginPage };
