// db/mongo.ts
import { MongoClient, Db, Collection } from 'mongodb'; 

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export async function connectDB(uri: string): Promise<Db> {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('X');
  return db;
}

export function getCommunity(db: Db): Collection {
  return db.collection('community');
}

export function insertCommunitySnapshot(db: Db, snapshot: any): Promise<any> {
  const collection = getCommunity(db);
  return collection.insertOne(snapshot);
}

