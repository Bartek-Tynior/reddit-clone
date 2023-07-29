"use client";

import { FC, useState } from "react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentValidatorType } from "@/lib/validators/comments";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";

interface CreateCommentProps {
    postId: string;
    replyToId?: string;
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId}) => {
  const [input, setInput] = useState<string>("");
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: createComment, isLoading: isLoadingNewComment } = useMutation(
    {
      mutationFn: async ({ postId, text, replyToId }: CommentValidatorType) => {
        const payload: CommentValidatorType = {
          postId,
          text,
          replyToId,
        };

        const { data } = await axios.patch(
          "/api/subreddit/post/comment",
          payload
        );
        return data;
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            return loginToast();
          }
        }

        return toast({
          title: "There was an error.",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        router.refresh();
        setInput("");
      },
    }
  );

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your Comment</Label>
      <div>
        <Textarea
          id="comment"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          rows={1}
          placeholder="Give your opinion..."
        />

        <div className="mt-2 flex justify-end">
          <Button
            isLoading={isLoadingNewComment}
            disabled={input.length === 0}
            onClick={() => createComment({ postId, text: input, replyToId })}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
