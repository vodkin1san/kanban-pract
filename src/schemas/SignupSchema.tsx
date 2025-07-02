import z from "zod";

const signupSchema = z
  .object({
    email: z.string().email("Укажите ваш email адрес"),
    password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
    confirmPassword: z
      .string()
      .min(6, "Пароль должен быть не менее 6 символов"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совподают",
    path: ["confirmPassword"],
  });

export type SignupFormInputs = z.infer<typeof signupSchema>;
export default signupSchema;
