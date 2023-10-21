import { ServerSidebar } from "@/components/server/server-sidebar";
import { getSpace } from "@/lib/get-spaces";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const ServerLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await initialProfile();

  if (!profile) {
    return redirect("/api/auth/signin?callbackUrl=/");
  }

  const server = await getSpace(params.serverId);
  return (
    <div>
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerLayout;
