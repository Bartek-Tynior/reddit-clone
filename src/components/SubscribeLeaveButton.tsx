"use client"

import { FC } from 'react'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'

interface SubscribeLeaveButtonProps {
  
}

const SubscribeLeaveButton: FC<SubscribeLeaveButtonProps> = ({}) => {
    const isSubscribed = false

    const {  } = useMutation({
        mutationFn: async () => {
            const payload = {
                
            } 
        }
    })

  return isSubscribed ? (
      <Button className='w-full mt-1 mb-4'>Leave Community</Button> 
      ) : ( 
    <Button className='w-full mt-1 mb-4'>Join to Post</Button> 
    )
}

export default SubscribeLeaveButton