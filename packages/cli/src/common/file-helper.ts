import { logger } from "../core/helpers/logger";
import { existsSync, readdirSync, statSync } from "fs";
import { basename, join } from "path";

export function findFiles(
  startPath: string,
  filter: RegExp,
  results: string[],
) {
  if (!existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }

  const files = readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = join(startPath, files[i]);
    //skip the actual thirdweb contract itself
    if (basename(filename, ".json") === "ThirdwebContract") {
      continue;
    }
    const stat = statSync(filename);

    // brownie has a "depdendencies" directory *inside* the build directory, if we detect that we should skip it
    if (stat.isDirectory() && basename(filename) === "dependencies") {
      logger.debug('skipping "dependencies" directory');
      continue;
    }
    // we never want to look in node_modules
    else if (stat.isDirectory() && basename(filename) === "node_modules") {
      logger.debug('skipping "node_modules" directory');
      continue;
    }
    if (stat.isDirectory()) {
      findFiles(filename, filter, results);
    } else if (filter.test(filename)) {
      results.push(filename);
    }
  }
}
