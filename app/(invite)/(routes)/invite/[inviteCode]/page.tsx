import {
  addUserToSpace,
  getSpace,
  getUserInSpace,
  spaceExists,
} from "@/lib/firebase-querys";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await initialProfile();

  if (!params.inviteCode) {
    return redirect("/");
  }

  const existsInSpace = await getUserInSpace(
    params.inviteCode,
    profile.id_user
  );

  if (existsInSpace) {
    return redirect(`/servers/${params.inviteCode}`);
  }

  const spaceExist = await spaceExists(params.inviteCode);

  if (!spaceExist) {
    return redirect("/");
  }

  addUserToSpace(params.inviteCode, profile.id_user);

  return redirect(`/servers/${params.inviteCode}`);
};

export default InviteCodePage;
