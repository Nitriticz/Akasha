"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { useState } from "react";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  ShieldQuestion,
} from "lucide-react";
import { kickUserFromSpace, updateUserRole } from "@/lib/firebase-querys";
import { useRouter } from "next/navigation";
import { DocumentData } from "firebase-admin/firestore";
import { cn } from "@/lib/utils";

export const MembersModal = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setloadingId] = useState("");

  const isModalOpen = isOpen && type === "members";
  const { spaceId, members, profile, roles, role } = data;

  const onRoleChange = async (userId: string, roleId: string) => {
    if (spaceId) {
      setloadingId(userId);
      await updateUserRole(spaceId, userId, roleId);
      const newMembers: Array<{
        id_user: string;
        image_path: string;
        nickname: string;
        description: string;
        role?: DocumentData | undefined;
      }> = [];
      members?.forEach((member) => {
        if (member.id_user == userId) {
          const newRole = roles?.find((role) => role.id === roleId);
          const newMember = {
            ...member,
            role: newRole?.role,
          };
          newMembers.push(newMember);
        } else {
          newMembers.push(member);
        }
      });

      onOpen("", "members", {
        spaceId,
        members: newMembers,
        profile,
        roles,
      });
      router.refresh();
      setloadingId("");
    }
  };

  const onKick = async (userId: string) => {
    if (spaceId) {
      setloadingId(userId);
      await kickUserFromSpace(spaceId, userId);
      const newMembers: Array<{
        id_user: string;
        image_path: string;
        nickname: string;
        description: string;
        role?: DocumentData | undefined;
      }> = [];
      members?.forEach((member) => {
        if (member.id_user != userId) {
          newMembers.push(member);
        }
      });

      onOpen("", "members", {
        spaceId,
        members: newMembers,
        profile,
        roles,
      });
      router.refresh();
      setloadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {role?.is_admin || role?.manage_members
              ? "Manage Members"
              : "Space Members"}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {members?.length} members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px]">
          {members?.map((member) => (
            <div
              key={member.id_user}
              className={cn(
                "flex items-center gap-x-2 mb-5 rounded-2xl p-2",
                profile?.id_user === member.id_user && "bg-indigo-500/30"
              )}
            >
              <UserAvatar src={member.image_path} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-3">
                  {member.nickname}
                  <Badge
                    className={cn(
                      "text-white",
                      member.role?.color === "green" &&
                        "bg-emerald-500 hover:bg-emerald-600",
                      member.role?.color === "red" &&
                        "bg-rose-500 hover:bg-rose-600",
                      member.role?.color === "blue" &&
                        "bg-indigo-500 hover:bg-indigo-600"
                    )}
                  >
                    {member.role?.name}
                  </Badge>
                </div>
                <p>{member.description}</p>
              </div>
              {profile?.id_user !== member.id_user &&
                role?.is_admin &&
                loadingId !== member.id_user && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex item-center">
                            <ShieldQuestion className="w-4 h-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {roles?.map(
                                (role) =>
                                  role.role.name !== "Admin" && (
                                    <DropdownMenuItem
                                      key={role.id}
                                      onClick={() =>
                                        onRoleChange(member.id_user, role.id)
                                      }
                                    >
                                      {role.role.name}
                                      {member?.role?.name ===
                                        role.role.name && (
                                        <Check className="h-4 w-4 ml-auto" />
                                      )}
                                    </DropdownMenuItem>
                                  )
                              )}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onKick(member.id_user)}
                        >
                          <Gavel className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id_user && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
