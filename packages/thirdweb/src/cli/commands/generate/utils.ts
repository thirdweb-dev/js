import fsPromises from "node:fs/promises";
import process from "node:process";
import { fileURLToPath } from "node:url";

import path from "node:path";
import { URL } from "node:url";

const toPath = (urlOrPath: string | URL) =>
  urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;

export type Options = {
  /**
   * The directory to start from.
   * @default process.cwd()
   */
  readonly cwd?: URL | string;

  /**
   * The type of path to match.
   * @default 'file'
   */
  readonly type?: "file" | "directory";

  /**
   * A directory path where the search halts if no matches are found before reaching this point.
   *
   * Default: Root directory
   */
  readonly stopAt?: URL | string;
};

async function findUp(
  name: string,
  { cwd = process.cwd(), type = "file", stopAt }: Options = {},
) {
  let directory = path.resolve(toPath(cwd) ?? "");
  const { root } = path.parse(directory);
  stopAt = path.resolve(directory, toPath(stopAt ?? root));

  while (directory && directory !== stopAt && directory !== root) {
    const filePath = path.isAbsolute(name) ? name : path.join(directory, name);

    try {
      const stats = await fsPromises.stat(filePath);
      if (
        (type === "file" && stats.isFile()) ||
        (type === "directory" && stats.isDirectory())
      ) {
        return filePath;
      }
    } catch {}

    directory = path.dirname(directory);
  }
  return undefined;
}

export type PackageDirectoryOptions = {
  /**
   * The directory to start searching from.
   * @default process.cwd()
   */
  readonly cwd?: string;
};

export async function packageDirectory({ cwd }: PackageDirectoryOptions = {}) {
  const filePath = await findUp("package.json", { cwd });
  return filePath && path.dirname(filePath);
}
