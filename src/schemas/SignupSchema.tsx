import z from "zod";

const signupSchema = z
  .object({
    email: z.string().email("auth:validation.emailInvalid"),
    password: z.string().min(6, "auth:validation.passwordMinLength"),
    confirmPassword: z.string().min(6, "auth:validation.passwordMinLength"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth:validation.passwordsMismatch",
    path: ["confirmPassword"],
  });

export type SignupFormInputs = z.infer<typeof signupSchema>;
export default signupSchema;
