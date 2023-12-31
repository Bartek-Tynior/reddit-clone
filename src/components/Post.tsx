import { formatTimeToNow } from '@/lib/utils'
import { Post, User, Vote } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { FC, useRef } from 'react'
import EditorContent from './EditorContent'
import PostVoteClient from './post-vote/PostVoteClient'

type PartialVote = Pick<Vote, 'type'>

interface PostProps {
  subredditName: string
  post: Post & {
    votes: Vote[]
    author: User
  }
  commentAmount: number
  votesAmount: number
  currentVote?: PartialVote
}

const Post: FC<PostProps> = ({subredditName, post, commentAmount, votesAmount, currentVote}) => {

  const postRef = useRef<HTMLDivElement>(null)

  return (
    <div className="rounded-md bg-[#202020] border border-white/10 shadow">
      <div className="px-6 py-4 flex justify-between">
        <PostVoteClient
          postId={post.id}
          initialUserVote={currentVote?.type}
          initialVotes={votesAmount}
        />

        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-white">
            {subredditName ? (
              <>
                <a
                  className="underline text-white text-sm underline-offset-2"
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </a>

                <span className="px-1">-</span>
              </>
            ) : null}

            <span>Posted by u/{post.author.username}</span>

            {formatTimeToNow(new Date(post.createdAt))}
          </div>

          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leaidng-6 text-white">
              {post.title}
            </h1>
          </a>

          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={postRef}
          >
            <EditorContent content={post.body} />

            {postRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#202020] to-transparent" />
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-[#202020] z-20 text-sm p-4 sm:px-6 text-white">
        <a
          href={`/r/${subredditName}/post/${post.id}`}
          className="w-fit flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          {commentAmount} Comments
        </a>
      </div>
    </div>
  );
}

export default Post