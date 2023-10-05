import type { BufferOrStringWithName } from "@thirdweb-dev/storage";

import { lstat, readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

export async function recurseFiles(
  uploadPath: string,
  basePath: string,
): Promise<BufferOrStringWithName[]> {
  const files = [];

  const fileType = await lstat(uploadPath);
  if (fileType.isFile()) {
    const fileName = relative(basePath, uploadPath);
    const fileData = await readFile(uploadPath);
    files.push({ name: fileName, data: fileData });
  } else if (fileType.isDirectory()) {
    const paths = await readdir(uploadPath);
    paths.forEach(async (subPath) => {
      const fullSubPath = join(uploadPath, subPath);
      const subFiles = await recurseFiles(fullSubPath, basePath);
      subFiles.forEach((file) => files.push(file));
    });
  }

  return files;
}
