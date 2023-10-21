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

  if (!spacesQuerySnapshot.empty) {
    const server = spacesQuerySnapshot.docs[0].data().id_space;
    return redirect(`/servers/${server}`);
  }

  return <InitialModal userId={profile.id_user}></InitialModal>;
};

export default SetupPage;
