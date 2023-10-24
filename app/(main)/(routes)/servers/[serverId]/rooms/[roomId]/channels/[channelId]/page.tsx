import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { getChannel, getRoom } from "@/lib/firebase-querys";
import { initialProfile } from "@/lib/initial-profile";

interface ChannelPageProps {
  params: {
    serverId: string;
    roomId: string;
    channelId: string;
  };
}

const ChannelPage = async ({ params }: ChannelPageProps) => {
  const profile = await initialProfile();

  const room = await getRoom(params.serverId, params.roomId);

  const channel = await getChannel(
    params.serverId,
    params.roomId,
    params.channelId
  );

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        spaceId={params.serverId}
        room={room}
        channel={channel}
        profile={profile}
      />
      {channel.type === "text" && (
        <>
          <ChatMessages
            spaceId={params.serverId}
            room={room}
            channel={channel}
            profile={profile}
          />
          <ChatInput
            spaceId={params.serverId}
            room={room}
            channel={channel}
            profile={profile}
          />
        </>
      )}
      {channel.type === "voice" && (
        <MediaRoom
          nickname={profile.nickname}
          chatId={params.channelId}
          video={false}
          voice={true}
        />
      )}
      {channel.type === "video" && (
        <MediaRoom
          nickname={profile.nickname}
          chatId={params.channelId}
          video={true}
          voice={false}
        />
      )}
    </div>
  );
};

export default ChannelPage;
