import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string().min(1, { message: "titleRequired" }),
  description: z.string().nullable(),
  createAt: z.string().nullable(),
  dueDate: z.string().nullable(),
  order: z.number().int().min(0, { message: "orderMinZero" }),
  columnId: z.string().trim().nullable(),
});

export type CreateTaskFormInputs = z.infer<typeof createTaskSchema>;

export default createTaskSchema;
