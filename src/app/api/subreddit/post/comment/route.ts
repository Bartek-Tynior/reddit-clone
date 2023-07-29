import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { commentValidator } from "@/lib/validators/comments";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { postId, text, replyToId } = commentValidator.parse(body);

    const session = await getAuthSession();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.comment.create({
      data: {
        text,
        replyToId,
        postId,
        authorId: session.user.id,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed!", { status: 422 });
    }

    return new Response("Could not post the comment, please try again later!", {
      status: 500,
    });
  }
}
