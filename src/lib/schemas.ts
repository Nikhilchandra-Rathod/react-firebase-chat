import { z } from "zod";

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must have mininum 2 characters",
    })
    .max(100, {
      message: "Name can not have more than 100 characters",
    }),
  email: z.string().email({
    message: "Please enter valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must have minimum 8 characters",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must have minimum 8 characters",
  }),
});

export const SearchUserSchema = z.object({
  searchTerm: z.string().min(2, {
    message: "Minimun 2 characters required",
  }),
});
