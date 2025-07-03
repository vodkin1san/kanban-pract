import z from "zod";
import type { TFunction } from "i18next";

const signupSchema = (t: TFunction) => {
  return z
    .object({
      email: z.string().email(t("auth:validation.emailInvalid")),
      password: z.string().min(6, t("auth:validation.passwordMinLength")),
      confirmPassword: z
        .string()
        .min(6, t("auth:validation.passwordMinLength")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth:validation.passwordsMismatch"),
      path: ["confirmPassword"],
    });
};

export type SignupFormInputs = z.infer<ReturnType<typeof signupSchema>>;
export default signupSchema;
