import { DocumentData } from "firebase-admin/firestore";
import { ChevronRight, Hash, Mic, Video } from "lucide-react";
import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "../user-avatar";

interface ChatHeaderProps {
  spaceId: string;
  room: {
    id: string;
    name: string;
    description: string;
    image_path: string;
  };
  channel: {
    id: string;
    name: string;
    type: string;
  };
  profile:
    | DocumentData
    | {
        id_user: string;
        image_path: string | null | undefined;
        nickname: string | null | undefined;
        description: string;
      };
}

export const ChatHeader = ({
  spaceId,
  room,
  channel,
  profile,
}: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle spaceId={spaceId} roomId={room.id} profile={profile} />
      <UserAvatar src={room.image_path} className="md:h-8 md:w-8" />
      <p className="ml-2 font-bold text-md text-black dark:text-white">
        {room.name} Room
      </p>
      <ChevronRight />
      {channel.type === "text" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {channel.type === "voice" && (
        <Mic className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {channel.type === "video" && (
        <Video className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">
        {channel.name}
      </p>
    </div>
  );
};
