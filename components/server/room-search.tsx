"use client";

import { Edit, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandList,
  CommandEmpty,
  CommandInput,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";
import { DocumentData } from "firebase-admin/firestore";
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

export const RoomSearch = ({
  spaceId,
  myRole,
}: {
  spaceId: string;
  myRole: DocumentData | undefined;
}) => {
  const { onOpen } = useModal();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const q = collection(db, `spaces/${spaceId}/rooms`);
  const [rooms] = useCollection(q);

  const roomsArray: {
    id: string;
    name: string;
    description: string;
    image_path: string;
  }[] = [];
  rooms?.forEach((room) => {
    const roomData = {
      id: room.id,
      name: room.data().name,
      description: room.data().description,
      image_path: room.data().image_path,
    };
    roomsArray.push(roomData);
  });

  useEffect(() => {
    const kDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", kDown);
    return () => document.removeEventListener("keydown", kDown);
  }, []);

  const onClick = async (idRoom: string) => {
    setOpen(false);
    const spaceRoomChannelsQuerySnapshot = await getDocs(
      query(
        collection(db, `spaces/${params?.serverId}/rooms/${idRoom}/channels`),
        where("name", "==", "general"),
        where("type", "==", "text")
      )
    );

    const channel = spaceRoomChannelsQuerySnapshot.docs[0].id;
    return router.push(
      `/servers/${params?.serverId}/rooms/${idRoom}/channels/${channel}`
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search Rooms
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for rooms" />
        <CommandList>
          <CommandEmpty>No Results Found</CommandEmpty>
        </CommandList>
        <CommandGroup heading="Available Rooms">
          {roomsArray?.map((room) => {
            return (
              <CommandItem
                key={room.id}
                onSelect={() => onClick(room.id)}
                className="flex items-center gap-x-3"
              >
                <UserAvatar src={room.image_path} />
                {room.name}
                {room.name !== "general" &&
                  (myRole?.is_admin || myRole?.rooms) && (
                    <div className="ml-auto flex items-center gap-x-2">
                      <ActionTooltip label="Edit">
                        <Edit
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen("", "editRoom", { spaceId, room });
                          }}
                          className="w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 cursor-pointer"
                        />
                      </ActionTooltip>
                      <ActionTooltip label="Delete">
                        <Trash
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen("", "deleteRoom", { spaceId, room });
                          }}
                          className="w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 cursor-pointer"
                        />
                      </ActionTooltip>
                    </div>
                  )}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandDialog>
    </>
  );
};
