"use client";

import {
  UsernameValidator,
  UsernameValidatorType,
} from "@/lib/validators/username";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { FC } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface UsernameFormProps {
  user: Pick<User, "id" | "username">;
}

const UsernameForm: FC<UsernameFormProps> = ({ user }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsernameValidatorType>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      username: user?.username || "",
    },
  });
    
    const router = useRouter()
    
    const { mutate: changeUsername, isLoading: isLoadingUsername } = useMutation({
      mutationFn: async ({ username }: UsernameValidatorType) => {
        const payload: UsernameValidatorType = {
          username,
        };

        const { data } = await axios.patch(`api/username`, payload);
        return data;
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 409) {
            return toast({
              title: "Username already taken!",
              description: "Please choose another username.",
              variant: "destructive",
            });
          }
        }

        toast({
          title: "An error occurred.",
          description:
            "An error occurred while changing username. Please try again later.",
          variant: "destructive",
        });
        },
        onSuccess: () => {
            toast({
                title: 'Username changed!',
                description: 'Your username has been changed.',
            })
            router.refresh()
        }
    });

  return (
    <form onSubmit={handleSubmit((e) => changeUsername(e))}>
      <Card>
        <CardHeader>
          <CardTitle>Your Username</CardTitle>

          <CardDescription>
            Please enter a display name for your account. You can change this at
            any time.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-content-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>

            <Label className="sr-only" htmlFor="username">
              Username
            </Label>

            <Input
              id="username"
              className="w-[400px] pl-6"
              size={32}
              {...register("username")}
            />

            {errors?.username && (
              <p className="px-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>
              </CardContent>
              

              <CardFooter>
                  <Button isLoading={isLoadingUsername}>
                      Change Username
                  </Button>
              </CardFooter>
      </Card>
    </form>
  );
};

export default UsernameForm;
