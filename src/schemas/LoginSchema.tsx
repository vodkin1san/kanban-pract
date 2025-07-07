import z from "zod";

const loginScheme = z.object({
  email: z.string().email("emailInvalid"),
  password: z.string().min(1, "passwordRequired"),
});

export type LoginFormInputs = z.infer<typeof loginScheme>;
export default loginScheme;
