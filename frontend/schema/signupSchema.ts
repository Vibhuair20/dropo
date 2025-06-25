import * as z from "zod";

export const signUpSchema = z
    .object({
        email: z
            .string()
            .trim()
            .min(8, {message: "email is required"})
            .email({message: "please enter a valid email"}),
        password: z
            .string()
            .trim()
            .min(8, {message: "passwaor is required of minimum 8 length"})
            .regex(/[a-z]/, { message: "must include a lowercase letter" })
            .regex(/[A-Z]/, { message: "must include an uppercase letter" })
            .regex(/[0-9]/, { message: "must include a number" })
            .regex(/[^a-zA-Z0-9]/, { message: "must include a special character" }),
        passwordConfirmation: z
            .string()
            .trim()
            .min(1, {message: "please confirm your password"}),
})
.refine((data) =>  data.password === data.passwordConfirmation, {
        message: "password do not match",
        path : ["passwordConfirmation"]
    })

