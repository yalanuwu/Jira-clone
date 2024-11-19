import z from "zod";

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password required'),
});

export const signUpSchema = z.object({
    name: z.string().trim().min(1, 'Name required'),
    email: z.string().email(),
    password: z.string().min(8, 'Minimum 8 characters required'),
});