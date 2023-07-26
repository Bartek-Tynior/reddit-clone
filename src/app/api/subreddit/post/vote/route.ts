import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostVoteValidator } from "@/lib/validators/votes";
import { CachedPost } from "@/types/redis";
import { z } from "zod";

const CACHE_AFTER_UPVOTES = 10;

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { postId, voteType } = PostVoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const existingVote = await db.vote.findFirst({
      where: {
        postId,
        userId: session.user.id,
      },
    });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });

        return new Response("Vote updated", { status: 200 });
      }

      await db.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });

      const votes = post.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1;
        if (vote.type === "DOWN") return acc - 1;

        return acc;
      }, 0);

      if (votes >= CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedPost = {
          id: post.id,
          title: post.title,
          authorUser: post.author.name ?? "",
          content: JSON.stringify(post.body),
          currentVote: voteType,
          createdAt: post.createdAt,
        };

        await redis.hset(`post:${post.id}`, cachePayload);
      }

      return new Response("Vote updated", { status: 200 });
    }

    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId,
      },
    });

    const votes = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;

      return acc;
    }, 0);

    if (votes >= CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedPost = {
        id: post.id,
        title: post.title,
        authorUser: post.author.name ?? "",
        content: JSON.stringify(post.body),
        currentVote: voteType,
        createdAt: post.createdAt,
      }
        
        await redis.hset(`post:${post.id}`, cachePayload);
    }
      
      return new Response("Vote created", { status: 201 });
  } catch (error) {
      
      if (error instanceof z.ZodError) {
        return new Response("Invalid request data passed!", { status: 422 });
      }

      return new Response("Could not save your vote, please try again later!", {
        status: 500,
      });

  }
}
