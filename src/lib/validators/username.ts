import { z } from "zod";

export const UsernameValidator = z.object({
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/)
})

export type UsernameValidatorType = z.infer<typeof UsernameValidator>;