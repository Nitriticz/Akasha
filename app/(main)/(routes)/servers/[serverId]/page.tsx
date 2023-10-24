import { db } from "@/app/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";

const ServerPage = async ({
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const spaceRoomsQuerySnapshot = await getDocs(
    query(
      collection(db, `spaces/${params.serverId}/rooms`),
      where("name", "==", "general")
    )
  );
  const room = spaceRoomsQuerySnapshot.docs[0].id;
  const spaceRoomChannelsQuerySnapshot = await getDocs(
    query(
      collection(db, `spaces/${params.serverId}/rooms/${room}/channels`),
      where("name", "==", "general"),
      where("type", "==", "text")
    )
  );
  const channel = spaceRoomChannelsQuerySnapshot.docs[0].id;
  return redirect(`${params.serverId}/rooms/${room}/channels/${channel}`);
};

export default ServerPage;
