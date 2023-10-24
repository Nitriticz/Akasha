"use client";

import { DocumentData, Timestamp } from "firebase-admin/firestore";
import { ChatWelcome } from "./chat-welcome";
import { collection, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { ChatItem } from "./chat-item";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface ChatInputProps {
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

export const ChatMessages = ({
  spaceId,
  room,
  channel,
  profile,
}: ChatInputProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const messagesRef = collection(
    db,
    `spaces/${spaceId}/rooms/${room.id}/channels/${channel.id}/messages`
  );
  const q = query(messagesRef, orderBy("created_at"));
  const [messagesSnapshot, loading] = useCollection(q);

  let messages: Array<{
    id: string;
    id_user: string;
    text: string;
    file_path: string;
    deleted: boolean;
    edited: boolean;
    created_at: Timestamp;
  }> = [];
  messagesSnapshot?.forEach((doc) => {
    const profile = {
      id: `${doc.id}`,
      id_user: `${doc.data().id_user}`,
      text: `${doc.data().text}`,
      file_path: `${doc.data().file_path}`,
      deleted: doc.data().deleted,
      edited: doc.data().edited,
      created_at: doc.data().created_at,
    };
    messages.push(profile);
  });

  useEffect(() => {
    if (messages.length) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages.length]);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={channel.type} name={channel.name} />
      <div className="flex flex-col mt-auto">
        {messages &&
          messages.map((message) => (
            <div key={message.id}>
              <ChatItem
                message={message}
                spaceId={spaceId}
                roomId={room.id}
                channelId={channel.id}
                profile={profile}
              />
            </div>
          ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
