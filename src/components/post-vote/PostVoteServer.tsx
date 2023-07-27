import { getAuthSession } from '@/lib/auth'
import { Post, Vote, VoteType } from '@prisma/client'
import { notFound } from 'next/navigation'
import { FC } from 'react'
import PostVoteClient from './PostVoteClient'

interface PostVoteServerProps {
    postId: string
    initialVotes?: number
    initialVote?: VoteType | null
    getData?: () => Promise<(Post & {votes: Vote[]}) | null>
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const PostVoteServer = async ({ postId, initialVotes, initialVote, getData }: PostVoteServerProps) => {
    const session = await getAuthSession()

    let _votes: number = 0
    let _currentVote: VoteType | null | undefined = undefined

    if (getData) {
        await wait(1000)
        const post = await getData()
        if (!post) return notFound()
        
        _votes = post.votes.reduce((acc, vote) => {
            if (vote.type === 'UP') return acc + 1
            if (vote.type === 'DOWN') return acc - 1

            return acc
        }, 0)

        _currentVote = post.votes.find((vote) => vote.userId === session?.user.id)?.type
    } else {
        _votes = initialVotes!
        _currentVote = initialVote
    }


    return <PostVoteClient postId={postId} initialVotes={_votes} initialUserVote={_currentVote} />
}

export default PostVoteServer