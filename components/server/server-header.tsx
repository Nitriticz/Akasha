"use client";

import { DocumentData } from "firebase-admin/firestore";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  MessageSquarePlus,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/app/firebase";

export const ServerHeader = ({
  space,
  spaceId,
  roomId,
  role,
  roles,
  profile,
}: {
  space: {
    id: string;
    name: string;
    description: string;
    image_path: string;
    is_public: boolean;
  };
  spaceId: string;
  roomId: string;
  role: DocumentData | undefined;
  roles: {
    id: string;
    role: FirebaseFirestore.DocumentData;
  }[];
  profile:
    | DocumentData
    | {
        id_user: string;
        image_path: string | null | undefined;
        nickname: string | null | undefined;
        description: string;
      };
}) => {
  const { onOpen } = useModal();

  const [realtimeMembers] = useCollection(
    query(collection(db, "space_users"), where("id_space", "==", spaceId))
  );
  let memberss: Array<string> = [""];
  let members: Array<{
    id_user: string;
    image_path: string;
    nickname: string;
    description: string;
    role?: DocumentData;
  }> = [];
  realtimeMembers?.forEach((doc) => {
    memberss.push(doc.data().id_user);
  });

  const [realtimeProfiles] = useCollection(
    query(collection(db, "profiles"), where("id_user", "in", memberss))
  );
  realtimeProfiles?.forEach((doc) => {
    const profile = {
      id_user: `${doc.data().id_user}`,
      image_path: `${doc.data().image_path}`,
      nickname: `${doc.data().nickname}`,
      description: `${doc.data().description}`,
    };
    members.push(profile);
  });

  const [memberRoles] = useCollection(
    collection(db, "spaces", spaceId, "user_roles")
  );

  const arrayMemberRoles = Array<{
    id_user: string;
    id_role: string;
  }>();
  memberRoles?.forEach((doc) => {
    const mr = {
      id_user: doc.data().id_user,
      id_role: doc.data().id_role,
    };
    arrayMemberRoles.push(mr);
  });

  members.forEach((member) => {
    const role = roles.find(
      (role) =>
        role.id ===
        arrayMemberRoles.find(
          (memberRole) => memberRole.id_user === member.id_user
        )?.id_role
    )?.role;
    member.role = role;
  });

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
            {space?.name}
            <ChevronDown className="h-5 w-5 ml-auto" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
          {(role?.is_admin || role?.invite) && (
            <DropdownMenuItem
              onClick={() => onOpen("", "invite", { spaceId })}
              className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
            >
              Invite People
              <UserPlus className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {role?.is_admin && (
            <DropdownMenuItem
              onClick={() => onOpen("", "editServer", { spaceId, space })}
              className="px-3 py-2 text-sm cursor-pointer"
            >
              Server Settings
              <Settings className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {role?.is_admin && (
            <DropdownMenuItem
              onClick={() =>
                onOpen("", "members", {
                  spaceId,
                  members,
                  profile,
                  roles,
                  role,
                })
              }
              className="px-3 py-2 text-sm cursor-pointer"
            >
              Manage Members
              <Users className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {(role?.is_admin || role?.create_channel) && (
            <DropdownMenuItem
              onClick={() =>
                onOpen("", "createRoom", {
                  spaceId,
                })
              }
              className="px-3 py-2 text-sm cursor-pointer"
            >
              Create Room
              <PlusCircle className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {(role?.is_admin || role?.create_channel) && (
            <DropdownMenuItem
              onClick={() =>
                onOpen("", "createChannel", {
                  spaceId,
                  roomId,
                })
              }
              className="px-3 py-2 text-sm cursor-pointer"
            >
              Create Channel
              <MessageSquarePlus className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {(role?.is_admin || role?.create_channel || role?.invite) && (
            <DropdownMenuSeparator />
          )}
          {role?.is_admin && (
            <DropdownMenuItem
              onClick={() => onOpen("", "deleteServer", { spaceId, space })}
              className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            >
              Delete Server
              <Trash className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {!role?.is_admin && !role?.manage_members && (
            <DropdownMenuItem
              onClick={() =>
                onOpen("", "members", {
                  spaceId,
                  members,
                  profile,
                  roles,
                  role,
                })
              }
              className="px-3 py-2 text-sm cursor-pointer"
            >
              Member List
              <Users className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {!role?.is_admin && (
            <DropdownMenuItem
              onClick={() =>
                onOpen("", "leaveServer", { profile, spaceId, space })
              }
              className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            >
              Leave Server
              <LogOut className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
