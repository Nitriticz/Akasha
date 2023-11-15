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
import { UserAction } from "../user-action";

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
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full py-3 bg-gradient-to-b bg-[#E3E5E8] dark:bg-[#1E1F22]">
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
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ThemeToggle />
        <UserAction profile={profile} />
      </div>
    </div>
  );
};
