/* eslint-disable @typescript-eslint/no-var-requires */
import { AsyncStorage } from "./AsyncStorage";

export class AsyncJsonFileStorage implements AsyncStorage {
  filePath: string;

  constructor(filePath: string) {
    this.filePath = require("node:path").resolve(filePath);
  }

  async getItem(key: string): Promise<string | null> {
    const content = await require("node:fs/promises").readFile(this.filePath, {
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
      const content = await require("node:fs/promises").readFile(
        this.filePath,
        {
          encoding: "utf-8",
        },
      );

      const data = content ? JSON.parse(content) : {};
      data[key] = value;

      await require("node:fs/promises").writeFile(
        this.filePath,
        JSON.stringify(data),
      );
    } catch {
      await require("node:fs/promises").writeFile(
        this.filePath,
        JSON.stringify({ [key]: value }),
      );
    }
  }

  async removeItem(key: string): Promise<void> {
    const content = await require("node:fs/promises").readFile(this.filePath, {
      encoding: "utf-8",
    });

    const data = JSON.parse(content);
    delete data[key];

    await require("node:fs/promises").writeFile(
      this.filePath,
      JSON.stringify(data),
    );
  }
}
