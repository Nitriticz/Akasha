import { ServerHeader } from "./server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RoomSearch } from "./room-search";
import { Separator } from "@/components/ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";

import {
  getChannels,
  getMemberRoles,
  getRoles,
  getRoom,
  getSpace,
} from "@/lib/firebase-querys";
import { DocumentData } from "firebase-admin/firestore";

interface ServerSidebarProps {
  spaceId: string;
  roomId: string;
  profile:
    | DocumentData
    | {
        id_user: string;
        image_path: string | null | undefined;
        nickname: string | null | undefined;
        description: string;
      };
}

export const ServerSidebar = async ({
  spaceId,
  roomId,
  profile,
}: ServerSidebarProps) => {
  const space = await getSpace(spaceId);
  const room = await getRoom(spaceId, roomId);
  const roles = await getRoles(space.id);
  const channels = await getChannels(space.id, room.id);
  const memberRoles = await getMemberRoles(space.id);

  const myRole = roles.find(
    (role) =>
      role.id ===
      memberRoles.find((memberRole) => memberRole.id_user === profile.id_user)
        ?.id_role
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader
        space={space}
        spaceId={spaceId}
        roomId={roomId}
        role={myRole}
        roles={roles}
        profile={profile}
      />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <RoomSearch spaceId={spaceId} myRole={myRole} />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        <div className="mb-2">
          <ServerSection
            spaceId={spaceId}
            roomId={roomId}
            typeChannel={"text"}
            myRole={myRole}
          />
          {channels.text.map((channel) => (
            <ServerChannel
              key={channel.id}
              spaceId={spaceId}
              roomId={roomId}
              myRole={myRole}
              channel={channel}
            />
          ))}
        </div>
        <div className="mb-2">
          <ServerSection
            spaceId={spaceId}
            roomId={roomId}
            typeChannel={"voice"}
            myRole={myRole}
          />
          {channels.voice.map((channel) => (
            <ServerChannel
              key={channel.id}
              spaceId={spaceId}
              roomId={roomId}
              myRole={myRole}
              channel={channel}
            />
          ))}
        </div>
        <div className="mb-2">
          <ServerSection
            spaceId={spaceId}
            roomId={roomId}
            typeChannel={"video"}
            myRole={myRole}
          />
          {channels.video.map((channel) => (
            <ServerChannel
              key={channel.id}
              spaceId={spaceId}
              roomId={roomId}
              myRole={myRole}
              channel={channel}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
