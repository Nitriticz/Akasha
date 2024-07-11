"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, Crown } from "lucide-react";
import { DocumentData } from "firebase-admin/firestore";

import { useModal } from "@/hooks/use-modal-store";

export const UserAction = ({
  profile,
}: {
  profile:
    | DocumentData
    | {
        id_user: string;
        image_path: string | null | undefined;
        nickname: string | null | undefined;
        description: string;
        subscribed: boolean;
      };
}) => {
  const { onOpen } = useModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer hover:opacity-75">
          <AvatarImage src={profile.image_path} />
          <AvatarFallback>PP</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-8" side="right">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onOpen("", "subscribe", { profile })}
          >
            <Crown className="mr-2 h-4 w-4" />
            <span>AkashaPlus</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-rose-500" onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
