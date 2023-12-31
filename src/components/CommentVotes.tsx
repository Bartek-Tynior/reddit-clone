"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { usePrevious } from "@mantine/hooks";
import { CommentVote, VoteType } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CommentVoteRequest, PostVoteRequest } from "@/lib/validators/votes";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

interface CommentVotesPageProps {
  commentId: string;
  initialVotes: number;
  initialUserVote?: Pick<CommentVote, "type">;
}

const CommentVotes: FC<CommentVotesPageProps> = ({
  commentId,
  initialVotes,
  initialUserVote,
}) => {
  const { loginToast } = useCustomToast();
  const [votes, setVotes] = useState<number>(initialVotes);
  const [currentVote, setCurrentVote] = useState(initialUserVote);
  const prevVote = usePrevious(currentVote);

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType,
      };

      await axios.patch("/api/subreddit/post/comment/vote", payload);
    },
    onError: (err, voteType) => {
      if (voteType === "UP") setVotes((prev) => prev - 1);
      else setVotes((prev) => prev + 1);

      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) return loginToast();
      }

      return toast({
        title: "Something went wrong",
        description: "Couldn't vote on post, please try again later",
        variant: "destructive",
      });
    },
    onMutate: (type) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined);
        if (type === "UP") setVotes((prev) => prev - 1);
        else if (type === "DOWN") setVotes((prev) => prev + 1);
      } else {
        setCurrentVote({ type });
        if (type === "UP") setVotes((prev) => prev + (currentVote ? 2 : 1));
        else if (type === "DOWN")
          setVotes((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex gap-1">
      <Button
        onClick={() => vote("UP")}
        size="sm"
        variant="ghost"
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote?.type === "UP",
          })}
        />
      </Button>

      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votes}
      </p>

      <Button
        onClick={() => vote("DOWN")}
        size="sm"
        variant="ghost"
        aria-label="downvote"
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote?.type === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVotes;
