import z from "zod";

const mySchema = z.object({
  name: z.string().min(1, "Название колонки не может быть пустым"),
});

export default mySchema;
