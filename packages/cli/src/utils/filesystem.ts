import { mkdir, lstat, readFile, writeFile } from "node:fs/promises";

import xdgAppPaths from "xdg-app-paths";

export const configDir = xdgAppPaths(".thirdweb").config();
export const cacheDir = xdgAppPaths(".thirdweb").cache();
export const credentialDir = xdgAppPaths(".thirdweb").data();

export async function ensureFSDirs() {
  await Promise.all([
    dirExists(configDir).then((exists) => {
      if (!exists) {
        return mkdir(configDir, { recursive: true });
      }
    }),
    dirExists(cacheDir).then((exists) => {
      if (!exists) {
        return mkdir(cacheDir, { recursive: true });
      }
    }),
  ]);
}

export async function fileExists(path: string) {
  try {
    return (await lstat(path)).isFile();
  } catch {
    return false;
  }
}

export async function dirExists(path: string) {
  try {
    return (await lstat(path)).isDirectory();
  } catch {
    return false;
  }
}

export class FSDataCacheWithTTL<T> {
  private cache: T | null = null;

  constructor(
    private filePath: string,
    private ttlMS: number,
  ) {}

  async get(): Promise<T | null> {
    if (!this.cache) {
      try {
        const file = await readFile(this.filePath, "utf-8");
        const parsedFile = JSON.parse(file) as { data: T; ttl: number };
        if (parsedFile.ttl < Date.now()) {
          return null;
        }
        this.cache = parsedFile.data;
      } catch {
        return null;
      }
    }
    return this.cache;
  }

  async set(data: T) {
    // immediately set the cache data
    this.cache = data;
    await writeFile(
      this.filePath,
      JSON.stringify({ data: data, ttl: Date.now() + this.ttlMS }),
    );
  }
}
