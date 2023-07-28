'use client'

import { UsernameValidator, UsernameValidatorType } from '@/lib/validators/username'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/Input'
import { Label } from './ui/label'

interface UsernameFormProps {
    user: Pick<User, 'id' | 'username'>
}

const UsernameForm: FC<UsernameFormProps> = ({ user }) => {
    
    const { handleSubmit, register, formState: { errors } } = useForm<UsernameValidatorType>({
        resolver: zodResolver(UsernameValidator),
        defaultValues: {
            username: user?.username || '',
        }
    })

    return <form onSubmit={handleSubmit(() => { })}>
        <Card>
            <CardHeader>
                <CardTitle>
                    Your Username
                </CardTitle>

                <CardDescription>
                    Please enter a display name for your account. You can change this at any time.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className='relative grid gap-1'>
                    <div className='absolute top-0 left-0 w-8 h-10 grid place-content-center'>
                        <span className='text-sm text-zinc-400'>
                            u/
                        </span>
                    </div>

                    <Label className='sr-only' htmlFor='username'>
                        <Input id='name' className='w-[400px] pl-6' size={32} {...register('username')} />
                    </Label>
                </div>
            </CardContent>
      </Card>
  </form>
}

export default UsernameForm