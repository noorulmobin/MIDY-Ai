import { openDB, DBSchema, IDBPDatabase } from "idb";

export interface IAiAvatarMaker {
  id?: number;
  url: string;
  original_url: string;
  created_at: string;
  task_id: string;
}

const DB_NAME = "ai-avatar-maker-database";
const STORE_NAME = "ai-avatar-maker-store";

interface MyDB extends DBSchema {
  [STORE_NAME]: {
    key: number;
    value: IAiAvatarMaker;
  };
}

export async function initDB(): Promise<IDBPDatabase<MyDB>> {
  const db = await openDB<MyDB>(DB_NAME, 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
  return db;
}

export async function addData(data: IAiAvatarMaker): Promise<IAiAvatarMaker> {
  delete data.id;
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const id = await store.add(data);
  await tx.done;

  return { ...data, id };
}

export async function getData(task_id?: string): Promise<IAiAvatarMaker[]> {
  const db = await initDB();
  const store = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME);
  const allRecords = await store.getAll();

  // Sort by id in descending order
  const sortedRecords = allRecords.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

  // Filter by originalUrl if provided
  const filteredRecords = task_id
    ? sortedRecords.filter((record) => record.task_id === task_id)
    : sortedRecords;

  return filteredRecords;
}

export async function deleteData(id: number): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.objectStore(STORE_NAME).delete(id);
  await tx.done;
}
