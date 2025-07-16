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
import { Link as RouterLink } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { loginUser } from "@store/authSlice";
import { setUser } from "@store/userProfileSlice";
import AppRoutes from "@enums/routes";
import loginSchema from "@schemas/LoginSchema";
import type { LoginFormInputs } from "@schemas/LoginSchema";
import { useTranslation } from "react-i18next";

const formContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 8,
};

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);
  const { t } = useTranslation(["auth", "common"]);

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

  const onSubmit = async (data: LoginFormInputs) => {
    const resultAction = await dispatch(
      loginUser({ email: data.email, password: data.password }),
    );

    if (loginUser.fulfilled.match(resultAction)) {
      dispatch(
        setUser({
          uid: resultAction.payload.uid,
          email: resultAction.payload.email,
        }),
      );
      navigate(AppRoutes.HOME);
    } else if (loginUser.rejected.match(resultAction)) {
      console.error(
        "auth:loginFailed",
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
            {t("auth:login")}
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
                label={t("auth:emailLabel")}
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
                type="password"
                label={t("auth:passwordLabel")}
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
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? t("auth:loggingIn") : t("auth:loginButton")}
          </Button>
          {authError && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {t("common:error")}: {authError}
            </Alert>
          )}
          <MuiLink component={RouterLink} to={AppRoutes.SIGNUP}>
            {t("auth:noAccountYetSignup")}
          </MuiLink>
        </Box>
      </Container>
    </>
  );
};

export { LoginPage };
