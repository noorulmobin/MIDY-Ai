"use client";

import Dexie, { type Table } from "dexie";

export interface HistoryItemType {
  id: string;
  url: string;
  inputText: string;
  ratio: string;
  createdAt: number;
  updatedAt: number;
}

class SessionDatabase extends Dexie {
  sessions!: Table<HistoryItemType>;

  constructor() {
    super("MouthPhotoHistorySessions");
    this.version(3).stores({
      sessions: "++id, url, ratio, inputText, createdAt, updatedAt",
    });
  }
}

const db = new SessionDatabase();

export const save = async (session: HistoryItemType) => {
  const result = session;

  const data = await db.sessions.get(result.id);

  if (data) {
    await db.sessions.update(session.id, { ...result });
  } else {
    await db.sessions.add({
      ...result,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }
};

export const getAll = async () => {
  const sessions = await db.sessions.toArray();
  return sessions;
};

export const remove = async (id: string) => {
  await db.sessions.delete(id);
};

/**
 * 获取数据列表里面最大的主键id
 * Retrieve the largest primary key ID from the data list
 * @returns
 */
export const getMaxId = async () => {
  const allData = await getAll();
  let maxId = 0;
  if (allData.length === 0) {
    return maxId;
  }
  allData.forEach((item) => {
    if (maxId < Number(item.id)) {
      maxId = Number(item.id);
    }
  });
  return maxId;
};
