//import { readFile, writeFile } from "fs/promises";
import fs from "fs/promises";

export const getMap = async () => {
  try {
    const data = await fs.readFile("map.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading file:", error);
  }
};
