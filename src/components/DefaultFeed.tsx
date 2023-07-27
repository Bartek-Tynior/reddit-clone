import { INFINITE_SCROLLING_PAGINATION } from "@/config"
import { db } from "@/lib/db"
import PostFeed from "./PostFeed"

const DefaultFeed = async () => {
    const posts = await db.post.findMany({
        orderBy: {
            createdAt: "desc"
        },
        include: {
            votes: true,
            subreddit: true,
            author: true,
            comments: true
        },
        take: INFINITE_SCROLLING_PAGINATION
    })

    return <PostFeed initialPosts={posts} />
}

export default DefaultFeed