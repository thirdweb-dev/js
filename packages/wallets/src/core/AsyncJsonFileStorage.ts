import { AsyncStorage } from "./AsyncStorage";
import fs from "fs/promises";
import path from "path";

export class AsyncJsonFileStorage implements AsyncStorage {
  filePath: string;

  constructor(filePath: string) {
    this.filePath = path.resolve(filePath);
  }

  async getItem(key: string): Promise<string | null> {
    const content = await fs.readFile(this.filePath, {
      encoding: "utf-8",
    });

    if (!content) {
      return null;
    }

    const data = JSON.parse(content);
    return data[key];
  }

  async setItem(key: string, value: string): Promise<void> {
    // if the file doesn't exist, create it

    try {
      const content = await fs.readFile(this.filePath, {
        encoding: "utf-8",
      });

      const data = content ? JSON.parse(content) : {};
      data[key] = value;

      await fs.writeFile(this.filePath, JSON.stringify(data));
    } catch {
      await fs.writeFile(this.filePath, JSON.stringify({ [key]: value }));
    }
  }

  async removeItem(key: string): Promise<void> {
    const content = await fs.readFile(this.filePath, {
      encoding: "utf-8",
    });

    const data = JSON.parse(content);
    delete data[key];

    await fs.writeFile(this.filePath, JSON.stringify(data));
  }
}
