import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from 'lucide-react';
import options from "@/config/auth"
import { getServerSession } from "next-auth"
import AuthButton from "./auth-button";

const ProfileMenu = async () => {
  const session = (await getServerSession(options))!
  if (session.user) return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={session.user.image ?? ""} alt="Avatar" />
          <AvatarFallback><User strokeWidth={"1px"} /></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" >
        <DropdownMenuLabel >My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center" disabled>{session.user.name}</DropdownMenuItem>
        <DropdownMenuItem className="justify-center">
          <AuthButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileMenu