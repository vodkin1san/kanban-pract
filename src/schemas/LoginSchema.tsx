import z from "zod";

const loginScheme = z.object({
  email: z.string().email("auth:validation.emailInvalid"),
  password: z.string().min(1, "auth:validation.passwordRequired"),
});

export type LoginFormInputs = z.infer<typeof loginScheme>;
export default loginScheme;
