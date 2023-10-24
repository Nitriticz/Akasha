import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationSideBar } from "@/components/navigation/navigation-sidebar";
import { ServerSidebar } from "@/components/server/server-sidebar";
import { DocumentData } from "firebase-admin/firestore";

interface MobileToggleProps {
  spaceId: string;
  roomId: string;
  profile:
    | DocumentData
    | {
        id_user: string;
        image_path: string | null | undefined;
        nickname: string | null | undefined;
        description: string;
      };
}

export const MobileToggle = ({
  spaceId,
  roomId,
  profile,
}: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavigationSideBar />
        </div>
        <ServerSidebar spaceId={spaceId} roomId={roomId} profile={profile} />
      </SheetContent>
    </Sheet>
  );
};
