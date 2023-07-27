import CreatePostMini from '@/components/CreatePostMini'
import PostFeed from '@/components/PostFeed'
import { INFINITE_SCROLLING_PAGINATION } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface PageProps {
    params: {
        slug: string
    }
}

const page = async ({params}: PageProps) => {

    const { slug } = params

    const session = await getAuthSession()

    const subreddit = await db.subreddit.findFirst({
        where: {
            name: slug
        },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                    comments: true,
                    subreddit: true
                },
                orderBy: {
                    createdAt: 'desc'
                },

                take: INFINITE_SCROLLING_PAGINATION,
            }
        }
    })

    if(!subreddit) return notFound()

    return (
        <div>
            <h1 className='font-bold text-3xl md:text-4xl h-14'>
                r/{subreddit.name}
            </h1>
            <CreatePostMini session={session} />

            <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name}/>

        </div>
    )

}

export default page