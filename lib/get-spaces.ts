import {
  QuerySnapshot,
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/app/firebase";

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
  const q = query(collection(db, "spaces"), where(documentId(), "==", spaceId));
  const spacesSnapshot = await getDocs(q);
  return spacesSnapshot.docs[0];
};
