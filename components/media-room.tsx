"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2 } from "lucide-react";
import { initialProfile } from "@/lib/initial-profile";

interface MediaRoomProps {
  nickname: string;
  chatId: string;
  video: boolean;
  voice: boolean;
}

export const MediaRoom = ({
  nickname,
  chatId,
  video,
  voice,
}: MediaRoomProps) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!nickname) return;

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${nickname}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [chatId, nickname]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={voice}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
