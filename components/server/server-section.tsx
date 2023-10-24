"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { DocumentData } from "firebase-admin/firestore";

export const ServerSection = ({
  spaceId,
  roomId,
  typeChannel,
  myRole,
}: {
  spaceId: string;
  roomId: string;
  typeChannel: string;
  myRole: DocumentData | undefined;
}) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {typeChannel} Channels
      </p>
      {(myRole?.is_admin || myRole?.channels) && (
        <ActionTooltip label="Crear Canal" side="top">
          <button
            onClick={() =>
              onOpen("", "createChannel", {
                spaceId,
                roomId,
                typeChannel,
              })
            }
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Plus />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
