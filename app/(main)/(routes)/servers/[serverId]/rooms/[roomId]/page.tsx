import { db } from "@/app/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";

const RoomPage = async ({
  params,
}: {
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
