import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/firebase";

export const initialProfile = async () => {
  const session = await getServerSession(options);

  if (!session) {
    return redirect("/api/auth/signin?callbackUrl=/");
  }

  const usersQuerySnapshot = await getDocs(
    query(collection(db, "users"), where("email", "==", session?.user?.email))
  );

  const userId = usersQuerySnapshot.docs[0].id;

  const profilesQuerySnapshot = await getDocs(
    query(collection(db, "profiles"), where("id_user", "==", userId))
  );

  if (!profilesQuerySnapshot.empty) {
    const profile = profilesQuerySnapshot.docs[0].data();
    return profile;
  }

  const data = {
    id_user: userId,
    image_path: session?.user?.image,
    nickname: session?.user?.name,
    description: "Hey there, I'm using Akasha!",
  };
  await addDoc(collection(db, "profiles"), data);

  return data;
};
