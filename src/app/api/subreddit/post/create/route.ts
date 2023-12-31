import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/posts";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const reqBody = await req.json();

    const { subredditId, title, body } = PostValidator.parse(reqBody);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("Subscribe to post!", { status: 400 });
    }

    await db.post.create({
      data: {
        title,
        body,
        authorId: session.user.id,
        subredditId,
      },
    });

    return new Response(subredditId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed!", { status: 422 });
    }

    return new Response(
      "Could not post to subreddit, please try again later!",
      { status: 500 }
    );
  }
}
