import z from "zod";

const сreateColumnSchema = z.object({
  name: z.string().min(1, "Название колонки не может быть пустым"),
});

export type CreateColumnFormInputs = z.infer<typeof сreateColumnSchema>;
export default сreateColumnSchema;
