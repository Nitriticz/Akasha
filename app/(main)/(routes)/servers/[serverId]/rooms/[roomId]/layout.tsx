import { ServerSidebar } from "@/components/server/server-sidebar";
import { getUserInSpace } from "@/lib/firebase-querys";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const ServerLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string; roomId: string };
}) => {
  const profile = await initialProfile();
  const userInSpace = await getUserInSpace(params.serverId, profile.id_user);
  if (!userInSpace) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar
          spaceId={params.serverId}
          roomId={params.roomId}
          profile={profile}
        />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerLayout;
