import { logger } from "../core/helpers/logger";
import { spinner } from "../core/helpers/logger";
import { BufferOrStringWithName, ThirdwebStorage } from "@thirdweb-dev/storage";
import chalk from "chalk";
import fs from "fs";
import path from "path";

function recurseFiles(
  uploadPath: string,
  basePath: string,
): BufferOrStringWithName[] {
  const files = [];

  const fileType = fs.lstatSync(uploadPath);
  if (fileType.isFile()) {
    const fileName = path.relative(basePath, uploadPath);
    const fileData = fs.readFileSync(uploadPath);
    files.push({ name: fileName, data: fileData });
  } else if (fileType.isDirectory()) {
    const paths = fs.readdirSync(uploadPath);
    paths.forEach((subPath) => {
      const fullSubPath = path.join(uploadPath, subPath);
      const subFiles = recurseFiles(fullSubPath, basePath);
      subFiles.forEach((file) => files.push(file));
    });
  }

  return files;
}

export async function upload(
  storage: ThirdwebStorage,
  uploadPath: string,
): Promise<string> {
  if (!uploadPath) {
    logger.error(
      `Please pass a path to a file or directory to upload with the following format:\n   ${chalk.blueBright(
        `npx thirdweb@latest upload path/to/file.jpg`,
      )}\n`,
    );
    process.exit(1);
  }

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
    const files = recurseFiles(uploadPath, uploadPath);

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
