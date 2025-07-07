import z from "zod";

const signupSchema = z
  .object({
    email: z.string().email("emailInvalid"),
    password: z.string().min(6, "passwordMinLength"),
    confirmPassword: z.string().min(6, "passwordMinLength"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordsMismatch",
    path: ["confirmPassword"],
  });

export type SignupFormInputs = z.infer<typeof signupSchema>;
export default signupSchema;
