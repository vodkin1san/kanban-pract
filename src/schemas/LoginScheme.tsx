import z from "zod";

const myScheme = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(1, "Пожалуйста, введите пароль"),
});

export default myScheme;
