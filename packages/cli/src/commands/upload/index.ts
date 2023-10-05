import { ThirdwebStorage } from "@thirdweb-dev/storage";
import chalk from "chalk";
import { logger } from "../../utils/logger";
import { recurseFiles } from "./utils";
import { Command } from "@commander-js/extra-typings";
import { ensureAuth } from "../../auth";
import { dirExists, fileExists } from "../../utils/filesystem";
import { spinner } from "../../legacy/core/helpers/logger";
import { parse } from "path";
import { readFile } from "fs/promises";

export const upload = new Command("upload")
  .description(
    "💾 Upload any file or directory to decentralized storage (IPFS)",
  )
  .argument("[path]", "path to file or directory to upload", ".")
  .option("-k, --key <key>", "API secret key to authorize usage")
  .action(async (path, options) => {
    console.log("resolved path", path);

    let uri = "";
    const [isDir, isFile] = await Promise.all([
      dirExists(path),
      fileExists(path),
    ]);

    if (!isDir && !isFile) {
      // in this case the path is neither a file nor a directory so we throw an error
      logger.error("Please specify a valid file or directory to upload");
      return;
    }

    const secretKey = await ensureAuth(options.key);
    const storage = new ThirdwebStorage(
      secretKey ? { secretKey: secretKey } : undefined,
    );

    if (isDir) {
      // in this case the path is a directory
      const files = await recurseFiles(path, path);
      if (files.length === 0) {
        logger.error("No files detected in specified directory");
        return;
      }
      const spin = spinner(
        "Uploading directory to IPFS. This may take a while depending on file sizes.",
      );
      try {
        const uris = await storage.uploadBatch(files);
        spin.succeed("Successfully uploaded directory to IPFS");
        uri = uris[0].substring(0, uris[0].lastIndexOf("/"));
      } catch (err) {
        spin.fail("Failed to upload directory to IPFS, please try again.");
        logger.debug(err);
      }
    } else {
      // the only other case is that it is a file
      const fileName = parse(path).base;
      const fileData = await readFile(path);
      const file = { name: fileName, data: fileData };

      const spin = spinner(
        "Uploading file to IPFS. This may take a while depending on file sizes.",
      );
      try {
        uri = await storage.upload(file, { uploadWithoutDirectory: true });
        spin.succeed("Successfully uploaded file to IPFS.");
      } catch (err: any) {
        spin.fail("Failed to upload file to IPFS.");
        logger.debug(err);
      }
    }

    logger.info(
      `Files stored at the following IPFS URI: ${chalk.blueBright(uri)}`,
    );

    const url = storage.resolveScheme(uri);
    logger.info(
      `Open this link to view your upload: ${chalk.blueBright(url.toString())}`,
    );
  });
