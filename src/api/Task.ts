import { firestore } from 'firebase/app';
import { collectionName } from '../constants/collectionName';
import { Task } from '../models/models';

export const fetchTasks = async () => {
  const collection = firestore().collection(collectionName.tasks);
  const snapShot = await collection.get();

  return snapShot.docs.map(doc => doc.data() as Task);
};

export const showTask = async ({ targetId }: { targetId: number }) => {
  const collection = firestore().collection(collectionName.tasks);
  const snapShot = await collection.doc(targetId.toString()).get();

  return snapShot.data() as Task;
};

export const addTask = async ({
  taskAttribute,
  callback,
}: {
  taskAttribute: Pick<Task, 'id' | 'title' | 'content' | 'labels' | 'status'>;
  callback?: () => void;
}) => {
  const doc = firestore()
    .collection(collectionName.tasks)
    .doc(taskAttribute.id.toString());
  await doc.set({
    ...taskAttribute,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
  doc.onSnapshot(() => callback && callback());
};

export const updateTask = async ({
  updateTaskAttribute,
  targetId,
  callback,
}: {
  updateTaskAttribute: Partial<Pick<Task, 'title' | 'content' | 'labels' | 'status'>>;
  targetId: number;
  callback?: () => void;
}) => {
  const doc = firestore()
    .collection(collectionName.tasks)
    .doc(targetId.toString());
  await doc.update({
    ...updateTaskAttribute,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
  doc.onSnapshot(() => callback && callback());
};

export const deleteTasks = async ({ targetIds, callback }: { targetIds: number[]; callback?: () => void }) => {
  const batch = firestore().batch();
  const collection = firestore().collection(collectionName.tasks);
  for (const id of targetIds) {
    batch.delete(collection.doc(id.toString()));
  }
  batch.commit();
  collection.onSnapshot(() => callback && callback());
};
