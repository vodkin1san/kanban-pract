import z from "zod";
import type { TFunction } from "i18next";

const loginScheme = (t: TFunction) => {
  return z.object({
    email: z.string().email(t("auth:validation.emailInvalid")),
    password: z.string().min(1, t("auth:validation.passwordRequired")),
  });
};

export type LoginFormInputs = z.infer<ReturnType<typeof loginScheme>>;
export default loginScheme;
