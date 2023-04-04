import { logger } from "../core/helpers/logger";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
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

    // brownie has a "dependencies" directory *inside* the build directory, if we detect that we should skip it
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

export function findMatches(
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
    const stat = statSync(filename);

    if (stat.isDirectory() && basename(filename) === "node_modules") {
      continue;
    }

    if (stat.isDirectory() && filename.startsWith(".")) {
      continue;
    }

    if (stat.isDirectory()) {
      findMatches(filename, filter, results);
    } else {
      const fileContents = readFileSync(filename, "utf-8");
      const matches = fileContents.match(filter);
      if (matches) {
        results.push(...matches);
      }
    }
  }
}
