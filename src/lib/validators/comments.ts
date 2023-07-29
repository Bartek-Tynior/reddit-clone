import { z } from "zod";

export const commentValidator = z.object({
    postId: z.string(),
    text: z.string().min(1).max(255),
    replyToId: z.string().optional(),
});

export type CommentValidatorType = z.infer<typeof commentValidator>;