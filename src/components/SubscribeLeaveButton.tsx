"use client"

import { FC, startTransition } from 'react'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { SubscribeSubredditPayload } from '@/lib/validators/subreddits'
import axios, { AxiosError } from 'axios'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface SubscribeLeaveButtonProps {
    subredditId: string
    isSubscribed: boolean
}

const SubscribeLeaveButton: FC<SubscribeLeaveButtonProps> = ({
    subredditId,
    isSubscribed
}) => {
    const { loginToast } = useCustomToast()
    const router = useRouter()

    const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeSubredditPayload = { 
                subredditId
            }
            
            const {data} = await axios.post('/api/subreddit/subscribe', payload)
            return data as string
        },
        onError: (error) => {
            if(error instanceof AxiosError) {
                if(error.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'There was an error.',
                description: 'Something went wrong. Please try again later.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })

            return toast({
                title: 'Subscribed!',
                description: 'You have successfully subscribed to this subreddit.',
            })
        }
    })

    const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeSubredditPayload = { 
                subredditId
            }
            
            const {data} = await axios.post('/api/subreddit/unsubscribe', payload)
            return data as string
        },
        onError: (error) => {
            if(error instanceof AxiosError) {
                if(error.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'There was an error.',
                description: 'Something went wrong. Please try again later.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })

            return toast({
                title: 'Unsubscribed!',
                description: 'You have successfully unsubscribed to this subreddit.',
            })
        }
    })

  return isSubscribed ? (
      <Button isLoading={isUnsubLoading} onClick={() => unsubscribe()} className='w-full mt-1 mb-4'>Leave Community</Button> 
      ) : ( 
    <Button isLoading={isSubLoading} onClick={() => subscribe()} className='w-full mt-1 mb-4'>Join to Post</Button> 
    )
}

export default SubscribeLeaveButton