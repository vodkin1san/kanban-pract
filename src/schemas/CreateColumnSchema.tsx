import z from "zod";

const сreateColumnSchema = z.object({
  name: z.string().min(1, "columnNameRequired"),
});

export type CreateColumnFormInputs = z.infer<typeof сreateColumnSchema>;
export default сreateColumnSchema;
