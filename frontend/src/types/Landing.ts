import { z } from "zod";

export const contactFormSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  email: z.string().email(),
  message: z.string().min(2).max(5000),
});

export type ContactData = z.infer<typeof contactFormSchema>;
