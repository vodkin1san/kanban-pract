import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Link as MuiLink,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { registerUser } from "../store/userSlice";
import AppRoutes from "../enums/routes";
import signupSchema from "../schemas/SignupSchema";
import type { SignupFormInputs } from "../schemas/SignupSchema";
import { useTranslation } from "react-i18next";

const SignupPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.user);
  const { t } = useTranslation("common");

  const onSubmit = async (data: SignupFormInputs) => {
    const resultAction = await dispatch(
      registerUser({ email: data.email, password: data.password }),
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
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Typography component="h1" variant="h5">
            {t("signup")}
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
                label={t("emailLabel")}
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
                label={t("passwordLabel")}
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
                label={t("confirmPasswordLabel")}
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
            {isLoading ? t("registering") : t("signupButton")}
          </Button>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {t("error")}: {error}
            </Typography>
          )}
          <MuiLink component={RouterLink} to={AppRoutes.LOGIN} variant="body2">
            {t("alreadyHaveAccountLogin")}
          </MuiLink>
        </Box>
      </Container>
    </>
  );
};

export { SignupPage };
