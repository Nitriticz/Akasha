import { db } from "@/app/firebase";
import { initialProfile } from "@/lib/initial-profile";
import { getSpaces } from "@/lib/firebase-querys";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "../theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const NavigationSideBar = async () => {
  const profile = await initialProfile();

  if (!profile) {
    return redirect("/");
  }

  const spacesQuerySnapshot = await getDocs(
    query(
      collection(db, "space_users"),
      where("id_user", "==", profile.id_user)
    )
  );

  const spaces = await getSpaces(spacesQuerySnapshot);

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
      <NavigationAction userId={profile.id_user} />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {spaces.map((space) => (
          <div key={space.id} className="mb-4">
            <NavigationItem
              id={space.id}
              name={space.data().name}
              imageUrl={space.data().image_path}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ThemeToggle />
        <Avatar>
          <AvatarImage src={profile.image_path} />
          <AvatarFallback>PP</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
