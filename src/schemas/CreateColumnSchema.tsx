import z from "zod";
import type { TFunction } from "i18next";

const сreateColumnSchema = (t: TFunction) => {
  return z.object({
    name: z.string().min(1, t("columns:validation.columnNameRequired")),
  });
};

export type CreateColumnFormInputs = z.infer<
  ReturnType<typeof сreateColumnSchema>
>;
export default сreateColumnSchema;
