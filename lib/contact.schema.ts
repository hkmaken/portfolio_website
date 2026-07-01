import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  // honeypot: real users leave this empty; bots fill it
  company: z.string().max(0).optional(),
});

export type ContactValues = z.infer<typeof contactSchema>;
