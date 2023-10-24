import { db } from "@/app/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";

export const RoomPage = async ({
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string; roomId: string };
}) => {
  const spaceRoomChannelsQuerySnapshot = await getDocs(
    query(
      collection(
        db,
        `spaces/${params.serverId}/rooms/${params.roomId}/channels`
      ),
      where("name", "==", "general"),
      where("type", "==", "text")
    )
  );
  const channel = spaceRoomChannelsQuerySnapshot.docs[0].id;
  return redirect(`${params.roomId}/channels/${channel}`);
};

export default RoomPage;
