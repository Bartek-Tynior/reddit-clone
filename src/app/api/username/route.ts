import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/username";
import { z } from "zod";

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json()

        const { username } = UsernameValidator.parse(body)

        const user = await db.user.findFirst({
            where: {
                username: username
            }
        })

        if (user) {
            return new Response('Username already taken!', { status: 409 })
        }

        await db.user.update({
            where: {
                id: session.user.id
            },
            data: {
                username: username
            }
        })

        return new Response('Username updated!', { status: 200 })

    } catch (error) {
        if (error instanceof z.ZodError) {
          return new Response("Invalid request data passed!", { status: 422 });
        }

        return new Response("Could not change the username, please try again later!", {
          status: 500,
        });

    }
}