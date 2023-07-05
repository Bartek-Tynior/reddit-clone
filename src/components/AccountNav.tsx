import { User } from 'next-auth'
import { FC } from 'react'
import { DropdownMenu, DropdownMenuTrigger } from './ui/DropdownMenu'
import UserAvatar from './UserAvatar'

interface AccountNavProps {
    user: Pick<User, 'name' | 'image' | 'email'>
}

const AccountNav: FC<AccountNavProps> = ({user}) => {
  return <DropdownMenu>
    <DropdownMenuTrigger>
        <UserAvatar user={user} />
    </DropdownMenuTrigger>
  </DropdownMenu>
}

export default AccountNav