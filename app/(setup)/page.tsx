import { db } from "../firebase";
import { redirect } from "next/navigation";
import { initialProfile } from "@/lib/initial-profile";
import { collection, getDocs, query, where } from "firebase/firestore";
import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
  const profile = await initialProfile();
  const spacesQuerySnapshot = await getDocs(
    query(
      collection(db, "space_users"),
      where("id_user", "==", profile.id_user)
    )
  );

  if (spacesQuerySnapshot.docs[0]) {
    const server = spacesQuerySnapshot.docs[0].data().id_space;
    const spaceRoomsQuerySnapshot = await getDocs(
      query(
        collection(db, `spaces/${server}/rooms`),
        where("name", "==", "general")
      )
    );
    const room = spaceRoomsQuerySnapshot.docs[0].id;
    const spaceRoomChannelsQuerySnapshot = await getDocs(
      query(
        collection(db, `spaces/${server}/rooms/${room}/channels`),
        where("name", "==", "general"),
        where("type", "==", "text")
      )
    );
    const channel = spaceRoomChannelsQuerySnapshot.docs[0].id;
    return redirect(`servers/${server}/rooms/${room}/channels/${channel}`);
  }

  return <InitialModal userId={profile.id_user}></InitialModal>;
};

export default SetupPage;
