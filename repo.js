import { ObjectId } from "mongodb";
import { conectToMongo, closeConnection } from "./mongo.js";
import { getMap } from "./map.js";

const db = await conectToMongo();

const games = db.collection("games");

const mapColl = db.collection("map");

export const getMapRepo = async () => {
  let cursor = mapColl.find({});
  let result = await cursor.toArray();
  if (!result.length) {
    const mapData = await getMap();
    let mapId = await mapColl.insertMany(mapData);
    let cursor = mapColl.find({});
    let result = await cursor.toArray();
  }
  await cursor.close();
  return result;
};

export const startGameRepo = async (game) => {
  const result = await games.insertOne(game);
  console.log(result);

  return result.insertedId;
};

export const getGameRepo = async (id) => {
  const _id = new ObjectId(id);
  const result = await games.findOne({ _id });
  return result;
};

//console.log(await getGameRepo("6a8bf4e2996698afd94de2df"));

export const updateGame = async (id, data) => {
  const _id = new ObjectId(id);

  const result = await games.updateOne({ _id }, { $set: data });
  return await result.modifiedCount;
};

const tryout = [{ id: 37, soldiers: 5 }];

tryout.map((item) => {
  if (item.id === 37) {
    item.soldiers += 10;
  }
});
