import {
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { DocumentData, FieldValue } from "firebase-admin/firestore";

enum ChannelType {
  text = "text",
  voice = "voice",
  video = "video",
}

export const getSpaces = async (spacesIds: QuerySnapshot) => {
  let spaces: Array<object | undefined> = [];

  spacesIds.forEach(async (space) => {
    spaces.push(space.data().id_space);
  });
  const q = query(collection(db, "spaces"), where(documentId(), "in", spaces));

  const spacesSnapshot = await getDocs(q);
  return spacesSnapshot.docs;
};

export const getSpace = async (spaceId: string) => {
  let space: {
    id: string;
    name: string;
    description: string;
    image_path: string;
    is_public: boolean;
  };
  const q = doc(db, `spaces/${spaceId}`);
  const spaceSnapshot = await getDoc(q);
  space = {
    id: spaceSnapshot.id,
    name: spaceSnapshot.data()?.name,
    description: spaceSnapshot.data()?.description,
    image_path: spaceSnapshot.data()?.image_path,
    is_public: spaceSnapshot.data()?.is_public,
  };

  return space;
};

export const getRoom = async (spaceId: string, roomId: string) => {
  let room: {
    id: string;
    name: string;
    description: string;
    image_path: string;
  };
  const q = doc(db, `spaces/${spaceId}/rooms/${roomId}`);
  const roomSnapshot = await getDoc(q);
  room = {
    id: roomSnapshot.id,
    name: roomSnapshot.data()?.name,
    description: roomSnapshot.data()?.description,
    image_path: roomSnapshot.data()?.image_path,
  };

  return room;
};

export const getMembers = async (spaceId: string) => {
  let members: Array<object | undefined> = [];
  let profiles: Array<{
    id_user: string;
    image_path: string;
    nickname: string;
    description: string;
    role?: DocumentData;
  }> = [];
  const q = query(
    collection(db, "space_users"),
    where("id_space", "==", spaceId)
  );
  const membersSnapshot = await getDocs(q);
  membersSnapshot.forEach(async (member) => {
    members.push(member.data().id_user);
  });
  const qProfiles = query(
    collection(db, "profiles"),
    where("id_user", "in", members)
  );
  const profilesSnapshot = await getDocs(qProfiles);
  profilesSnapshot.forEach((doc) => {
    const profile = {
      id_user: `${doc.data().id_user}`,
      image_path: `${doc.data().image_path}`,
      nickname: `${doc.data().nickname}`,
      description: `${doc.data().description}`,
    };
    profiles.push(profile);
  });
  return profiles;
};

export const getUserInSpace = async (spaceId: string, userId: string) => {
  const q = query(
    collection(db, "space_users"),
    where("id_space", "==", spaceId),
    where("id_user", "==", userId)
  );

  const spacesSnapshot = await getDocs(q);
  if (spacesSnapshot.docs[0]) {
    return true;
  }
  return false;
};

export const getChannels = async (spaceId: string, roomId: string) => {
  const channels = {
    text: Array<{ id: string; name: string; type: string }>(),
    voice: Array<{ id: string; name: string; type: string }>(),
    video: Array<{ id: string; name: string; type: string }>(),
  };

  const q = collection(db, "spaces", spaceId, "rooms", roomId, "channels");

  const channelsSnapshot = await getDocs(q);
  channelsSnapshot.forEach((ch) => {
    switch (ch.data().type) {
      case "text":
        channels.text.push({
          id: ch.id,
          name: ch.data().name,
          type: ch.data().type,
        });
        break;
      case "voice":
        channels.voice.push({
          id: ch.id,
          name: ch.data().name,
          type: ch.data().type,
        });
        break;
      case "video":
        channels.video.push({
          id: ch.id,
          name: ch.data().name,
          type: ch.data().type,
        });
        break;

      default:
        break;
    }
  });

  return channels;
};

export const getRoles = async (spaceId: string) => {
  const roles = Array<{ id: string; role: DocumentData }>();
  const q = collection(db, "spaces", spaceId, "roles");
  const rolesSnapshot = await getDocs(q);
  rolesSnapshot.forEach((role) => {
    roles.push({ id: role.id, role: role.data() });
  });
  return roles;
};

export const getMemberRoles = async (spaceId: string) => {
  const memberRoles = Array<DocumentData>();
  const q = collection(db, "spaces", spaceId, "user_roles");
  const memberRolesSnapshot = await getDocs(q);
  memberRolesSnapshot.forEach((memberRole) => {
    memberRoles.push(memberRole.data());
  });
  return memberRoles;
};

export const spaceExists = async (spaceId: string) => {
  const q = query(collection(db, "spaces"), where(documentId(), "==", spaceId));
  const spacesSnapshot = await getDocs(q);
  if (spacesSnapshot.docs[0]) {
    return true;
  }
  return false;
};

export const addUserToSpace = async (spaceId: string, userId: string) => {
  await addDoc(collection(db, "space_users"), {
    id_space: spaceId,
    id_user: userId,
  });

  const q = query(
    collection(db, `spaces/${spaceId}/roles`),
    where("name", "==", "Member")
  );
  const memberRoleSnapshot = await getDocs(q);

  await addDoc(collection(db, `spaces/${spaceId}/user_roles`), {
    id_role: memberRoleSnapshot.docs[0].id,
    id_user: userId,
  });
};

export const updateSpace = async (spaceId: string, values: any) => {
  const spaceData = {
    name: values.name,
    description: "",
    image_path: values.imageUrl,
    is_public: true,
  };

  await updateDoc(doc(db, "spaces", spaceId), spaceData);
};

export const updateUserRole = async (
  spaceId: string,
  userId: string,
  roleId: string
) => {
  const userRoleData = {
    id_user: userId,
    id_role: roleId,
  };

  const q = query(
    collection(db, `spaces/${spaceId}/user_roles`),
    where("id_user", "==", userId)
  );

  const userRoles = await getDocs(q);
  const userRoleId = userRoles.docs[0].id;

  await updateDoc(
    doc(db, `spaces/${spaceId}/user_roles`, userRoleId),
    userRoleData
  );
};

export const createSpace = async (
  spaceData: {
    name: string;
    description: string;
    image_path: string;
    is_public: boolean;
  },
  userId: any
) => {
  const serverRef = await addDoc(collection(db, "spaces"), spaceData);
  const AdminRoleData = {
    name: "Admin",
    is_admin: true,
    color: "red",
  };
  const roleRef = await addDoc(
    collection(db, `spaces/${serverRef.id}/roles`),
    AdminRoleData
  );
  const MemberRoleData = {
    name: "Member",
    is_admin: false,
    color: "green",
  };
  await addDoc(collection(db, `spaces/${serverRef.id}/roles`), MemberRoleData);
  const userRoleData = {
    id_user: userId,
    id_role: roleRef.id,
  };
  await addDoc(
    collection(db, `spaces/${serverRef.id}/user_roles`),
    userRoleData
  );
  const roomData = {
    name: "general",
    image_path: "",
    description: "General Room of the Space",
  };
  const roomRef = await addDoc(
    collection(db, `spaces/${serverRef.id}/rooms`),
    roomData
  );
  const textChannelData = {
    name: "general",
    type: "text",
  };
  await addDoc(
    collection(db, `spaces/${serverRef.id}/rooms/${roomRef.id}/channels`),
    textChannelData
  );
  const voiceChannelData = {
    name: "general",
    type: "voice",
  };
  await addDoc(
    collection(db, `spaces/${serverRef.id}/rooms/${roomRef.id}/channels`),
    voiceChannelData
  );
  const videoChannelData = {
    name: "general",
    type: "video",
  };
  await addDoc(
    collection(db, `spaces/${serverRef.id}/rooms/${roomRef.id}/channels`),
    videoChannelData
  );
  await addDoc(collection(db, "space_users"), {
    id_space: serverRef.id,
    id_user: userId,
  });
};

export const kickUserFromSpace = async (spaceId: string, userId: string) => {
  const qUserRoles = query(
    collection(db, `spaces/${spaceId}/user_roles`),
    where("id_user", "==", userId)
  );
  const userRolesSnapshot = await getDocs(qUserRoles);

  await deleteDoc(
    doc(db, `spaces/${spaceId}/user_roles`, userRolesSnapshot.docs[0].id)
  );

  const qSpaceUsers = query(
    collection(db, "space_users"),
    where("id_space", "==", spaceId),
    where("id_user", "==", userId)
  );
  const spaceUsersSnapshot = await getDocs(qSpaceUsers);

  await deleteDoc(doc(db, "space_users", spaceUsersSnapshot.docs[0].id));
};

export const createChannel = async (
  spaceId: string,
  roomId: string,
  channelData: {
    name: string;
    type: ChannelType;
  }
) => {
  await addDoc(
    collection(db, `spaces/${spaceId}/rooms/${roomId}/channels`),
    channelData
  );
};

export const deleteSpace = async (spaceId: string) => {
  const q = query(
    collection(db, "space_users"),
    where("id_space", "==", spaceId)
  );
  const spaceUsersSnapshot = await getDocs(q);

  spaceUsersSnapshot.forEach(async (spaceUser) => {
    await deleteDoc(doc(db, "space_users", spaceUser.id));
  });

  await deleteDoc(doc(db, "spaces", spaceId));
};

export const deleteChannel = async (
  spaceId: string,
  roomId: string,
  channelId: string
) => {
  await deleteDoc(
    doc(db, `/spaces/${spaceId}/rooms/${roomId}/channels`, channelId)
  );
};

export const updateChannel = async (
  spaceId: string,
  roomId: string,
  channelId: string,
  channelData: {
    name: string;
    type: ChannelType;
  }
) => {
  await updateDoc(
    doc(db, `/spaces/${spaceId}/rooms/${roomId}/channels/${channelId}`),
    channelData
  );
};

export const createRoom = async (
  spaceId: string,
  roomData: {
    name: string;
    description: string;
    image_path: string;
  }
) => {
  const roomRef = await addDoc(
    collection(db, `spaces/${spaceId}/rooms`),
    roomData
  );

  const textChannelData = {
    name: "general",
    type: "text",
  };
  await addDoc(
    collection(db, `spaces/${spaceId}/rooms/${roomRef.id}/channels`),
    textChannelData
  );
  const voiceChannelData = {
    name: "general",
    type: "voice",
  };
  await addDoc(
    collection(db, `spaces/${spaceId}/rooms/${roomRef.id}/channels`),
    voiceChannelData
  );
  const videoChannelData = {
    name: "general",
    type: "video",
  };
  await addDoc(
    collection(db, `spaces/${spaceId}/rooms/${roomRef.id}/channels`),
    videoChannelData
  );
};

export const updateRoom = async (
  spaceId: string,
  roomId: string,
  roomData: {
    name: string;
    description: string;
    image_path: string;
  }
) => {
  await updateDoc(doc(db, `/spaces/${spaceId}/rooms/${roomId}`), roomData);
};

export const deleteRoom = async (spaceId: string, roomId: string) => {
  await deleteDoc(doc(db, `/spaces/${spaceId}/rooms`, roomId));
};

export const getChannel = async (
  spaceId: string,
  roomId: string,
  channelId: string
) => {
  let channel: { id: string; name: string; type: string };
  const q = doc(db, `spaces/${spaceId}/rooms/${roomId}/channels/${channelId}`);
  const channelSnapshot = await getDoc(q);
  channel = {
    id: channelSnapshot.id,
    name: channelSnapshot.data()?.name,
    type: channelSnapshot.data()?.type,
  };

  return channel;
};

export const sendMessage = async (
  spaceId: string,
  roomId: string,
  channelId: string,
  messageData: {
    id_user: any;
    text: string;
    file_path: string;
    edited: boolean;
    deleted: boolean;
    created_at: FieldValue;
  }
) => {
  await addDoc(
    collection(
      db,
      `spaces/${spaceId}/rooms/${roomId}/channels/${channelId}/messages`
    ),
    messageData
  );
};

export const getProfile = async (userId: string) => {
  let profile: {
    id_profile: string;
    id_user: string;
    nickname: string;
    description: string;
    image_path: string;
    subscribed: boolean;
  };
  const q = query(collection(db, "profiles"), where("id_user", "==", userId));
  const profileSnapshot = await getDocs(q);
  profile = {
    id_profile: profileSnapshot.docs[0].id,
    id_user: profileSnapshot.docs[0].data()?.id_user,
    nickname: profileSnapshot.docs[0].data()?.nickname,
    description: profileSnapshot.docs[0].data()?.description,
    image_path: profileSnapshot.docs[0].data()?.image_path,
    subscribed: profileSnapshot.docs[0].data()?.subscribed,
  };

  return profile;
};

export const getRole = async (userId: string, spaceId: string) => {
  let role: {
    name: string;
    color: string;
    is_admin: boolean;
    rooms?: boolean;
    channels?: boolean;
    delete_messages?: boolean;
    kick?: boolean;
  };
  const qUserRoles = query(
    collection(db, `spaces/${spaceId}/user_roles`),
    where("id_user", "==", userId)
  );
  const profileSnapshot = await getDocs(qUserRoles);
  const qRole = doc(
    db,
    `spaces/${spaceId}/roles/${profileSnapshot.docs[0].data().id_role}`
  );
  const roleSnapshot = await getDoc(qRole);
  role = {
    name: roleSnapshot.data()?.name,
    color: roleSnapshot.data()?.color,
    is_admin: roleSnapshot.data()?.is_admin,
    rooms: roleSnapshot.data()?.rooms,
    channels: roleSnapshot.data()?.channels,
    delete_messages: roleSnapshot.data()?.delete_messages,
    kick: roleSnapshot.data()?.kick,
  };

  return role;
};

export const updateMessage = async (
  spaceId: string,
  roomId: string,
  channelId: string,
  messageId: string,
  messageData: {
    id_user: any;
    text: string;
    edited: boolean;
    deleted: any;
    file_path: any;
    created_at: any;
  }
) => {
  await updateDoc(
    doc(
      db,
      `/spaces/${spaceId}/rooms/${roomId}/channels/${channelId}/messages/${messageId}`
    ),
    messageData
  );
};

export const deleteMessage = async (
  spaceId: string,
  roomId: string,
  channelId: string,
  messageId: string,
  messageData: DocumentData
) => {
  await updateDoc(
    doc(
      db,
      `spaces/${spaceId}/rooms/${roomId}/channels/${channelId}/messages/${messageId}`
    ),
    messageData
  );
};

export const subscribeUser = async (userId: string) => {
  let profile: {
    id_user: string;
    nickname: string;
    description: string;
    image_path: string;
    subscribed: boolean;
  };
  const q = query(collection(db, "profiles"), where("id_user", "==", userId));
  const profileSnapshot = await getDocs(q);
  const id_profile = profileSnapshot.docs[0].id;
  profile = {
    id_user: profileSnapshot.docs[0].data()?.id_user,
    nickname: profileSnapshot.docs[0].data()?.nickname,
    description: profileSnapshot.docs[0].data()?.description,
    image_path: profileSnapshot.docs[0].data()?.image_path,
    subscribed: true,
  };

  await updateDoc(doc(db, `profiles/${id_profile}`), profile);
};
