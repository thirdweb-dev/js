import { logger } from "../core/helpers/logger";
import { spinner } from "../core/helpers/logger";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import chalk from "chalk";
import fs from "fs";
import path from "path";

export async function upload(
  storage: ThirdwebStorage,
  uploadPath: string,
): Promise<string> {
  const pathExists = fs.existsSync(uploadPath);
  if (!pathExists) {
    logger.error(
      `Invalid path ${chalk.blueBright(
        uploadPath,
      )} provided. Please provide a valid path to a file or directory to upload."`,
    );
    process.exit(1);
  }

  let uri = "";
  const fileType = fs.lstatSync(uploadPath);
  if (fileType.isDirectory()) {
    const subPaths = fs.readdirSync(uploadPath);
    const filePaths = subPaths
      .map((subPath) => path.join(uploadPath, subPath))
      .filter((subPath) => fs.lstatSync(subPath).isFile());
    const files = filePaths.map((filePath) => {
      const fileName = path.parse(filePath).base;
      const fileData = fs.readFileSync(filePath);
      return { name: fileName, data: fileData };
    });

    if (files.length === 0) {
      logger.error(
        `No files detected in specified directory ${chalk.blueBright(
          uploadPath,
        )} to upload.`,
      );
      process.exit(1);
    }

    const spin = spinner(
      "Uploading directory to IPFS. This may take a while depending on file sizes.",
    );
    const uris = await storage.uploadBatch(files);
    spin.succeed("Successfully uploaded directory to IPFS");
    uri = uris[0].substring(0, uris[0].lastIndexOf("/"));
  } else if (fileType.isFile()) {
    const fileName = path.parse(uploadPath).base;
    const fileData = fs.readFileSync(uploadPath);
    const file = { name: fileName, data: fileData };

    const spin = spinner(
      "Uploading file to IPFS. This may take a while depending on file sizes.",
    );
    uri = await storage.upload(file, { uploadWithoutDirectory: true });
    spin.succeed("Succesfully uploaded file to IPFS.");
  } else {
    logger.error(
      `Path ${chalk.blueBright(
        uploadPath,
      )} does not point to a valid file or directory. Please provide a valid path to a file or directory to upload`,
    );
    process.exit(1);
  }

  return uri;
}
