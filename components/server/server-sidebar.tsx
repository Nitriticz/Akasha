import { getSpace } from "@/lib/get-spaces";
import { initialProfile } from "@/lib/initial-profile";

interface ServerSidebarProps {
  serverId: string;
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await initialProfile();
  const server = await getSpace(serverId);
  return <div>ServerSidebar</div>;
};
