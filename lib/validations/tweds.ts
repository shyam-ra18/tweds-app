import * as z from "zod";

export const TwedValidation = z.object({
  twed: z.string().nonempty().min(3, { message: "Minimum 3 characters" }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  twed: z.string().nonempty().min(3, { message: "Minimum 3 characters" }),
});
