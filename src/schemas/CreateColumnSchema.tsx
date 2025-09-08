import z from "zod";

const сreateColumnSchema = z.object({
  name: z.string().min(1, "columnNameRequired"),
  taskIds: z.array(z.string()).optional(),
});

export type CreateColumnFormInputs = z.infer<typeof сreateColumnSchema>;
export default сreateColumnSchema;
