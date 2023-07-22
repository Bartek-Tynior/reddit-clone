import { z } from "zod";

export const PostValidator = z.object({
    title: z.string().min(3, {message: 'Title must be longer than  characters!'})
    .max(255, {message: 'Title must be shorter than 255 characters!'}),
    body: z.any(),
    subredditId: z.string(),
});

export type PostCreatoionType = z.infer<typeof PostValidator>;