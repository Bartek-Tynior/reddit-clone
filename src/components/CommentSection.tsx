import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";

interface CommentSectionProps {
  postId: string;
}

const CommentSection = async ({ postId }: CommentSectionProps) => {
  const session = await getAuthSession();

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className="w-full h-px my-6" />

      <CreateComment postId={postId} />

      <div className="flex flex-col gap-y-6 mt-4">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topComment) => {
            const topCommentVotes = topComment.votes.reduce((acc, vote) => {
              if (vote.type === "UP") acc += 1;
              if (vote.type === "DOWN") acc -= 1;
              return acc;
            }, 0);

            const topCommentVote = topComment.votes.find(
              (vote) => vote.userId === session?.user.id
            );

            return (
              <div key={topComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    postId={postId}
                    currentVote={topCommentVote}
                    votes={topCommentVotes}
                    comment={topComment}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentSection;
