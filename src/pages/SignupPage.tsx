import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Link as MuiLink,
  Alert,
  type SxProps,
  type Theme,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { registerUser } from "@store/userSlice";
import AppRoutes from "@enums/routes";
import signupSchema from "@schemas/SignupSchema";
import type { SignupFormInputs } from "@schemas/SignupSchema";
import { useTranslation } from "react-i18next";

const formContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 8,
};

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.user);
  const { t } = useTranslation(["auth", "common"]);

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

  const onSubmit = async (data: SignupFormInputs) => {
    const resultAction = await dispatch(
      registerUser({ email: data.email, password: data.password }),
    );
    if (registerUser.fulfilled.match(resultAction)) {
      navigate(AppRoutes.HOME);
    } else if (registerUser.rejected.match(resultAction)) {
      console.error(
        "auth:signupFailed",
        resultAction.payload || resultAction.error.message,
      );
    }
  };
  return (
    <>
      <Container maxWidth="xs">
        <Box
          noValidate
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={formContainerStyles}
        >
          <Typography component="h1" variant="h5">
            {t("auth:signup")}
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
                label={t("auth:emailLabel")}
                type="email"
                margin="normal"
                error={!!errors.email}
                helperText={
                  errors.email?.message
                    ? t(`auth:validation.${errors.email.message}`)
                    : undefined
                }
                disabled={isLoading}
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
                label={t("auth:passwordLabel")}
                type="password"
                margin="normal"
                error={!!errors.password}
                helperText={
                  errors.password?.message
                    ? t(`auth:validation.${errors.password.message}`)
                    : undefined
                }
                disabled={isLoading}
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
                label={t("auth:confirmPasswordLabel")}
                type="password"
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={
                  errors.confirmPassword?.message
                    ? t(`auth:validation.${errors.confirmPassword.message}`)
                    : undefined
                }
                disabled={isLoading}
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
            {isLoading ? t("auth:registering") : t("auth:signupButton")}
          </Button>
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {t("common:error")}: {error}
            </Alert>
          )}
          <MuiLink component={RouterLink} to={AppRoutes.LOGIN} variant="body2">
            {t("auth:alreadyHaveAccountLogin")}
          </MuiLink>
        </Box>
      </Container>
    </>
  );
};

export { SignupPage };
