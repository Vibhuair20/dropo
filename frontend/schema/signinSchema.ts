import * as z from "zod";

export const signInSchema = z.object({
    identifier : z
        .string()
        .min(1, {message : "email is required"})
        .email({message: "please enter a vaaalid email"}),
    password : z
        .string()
        .min(1, {message: "password is required"})
        .min(8, {message: "password must be fo 8 length"}),
});