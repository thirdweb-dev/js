/* eslint-disable import/no-extraneous-dependencies */
import type { PackageManager } from "./get-pkg-manager";
import { getStartOrDev } from "./get-start-or-dev";
import { tryGitInit } from "./git";
import { install } from "./install";
import { isFolderEmpty } from "./is-folder-empty";
import { getOnline } from "./is-online";
import { isWriteable } from "./is-writeable";
import { makeDir } from "./make-dir";
import { downloadAndExtractRepo, hasTemplate } from "./templates";
import retry from "async-retry";
import chalk from "chalk";
import path from "path";

export class DownloadError extends Error {}

export async function createApp({
  appPath,
  packageManager,
  framework,
  language,
  template,
}: {
  appPath: string;
  packageManager: PackageManager;
  framework?: string;
  language?: string;
  template?: string;
}): Promise<void> {
  let frameworkPath = "";

  if (template) {
    const found = await hasTemplate(template);

    if (!found) {
      console.error(
        `Could not locate the repository for ${chalk.red(
          `"${template}"`,
        )}. Please check that the repository exists and try again.`,
      );
      process.exit(1);
    }
  } else if (framework) {
    frameworkPath = `${framework}-${language || "javascript"}-starter`;
    const found = await hasTemplate(frameworkPath);

    if (!found) {
      console.error(
        `Something went wrong with the ${chalk.red(
          `"${framework}"`,
        )} framework. Please try again.`,
      );
      process.exit(1);
    }
  }

  const root = path.resolve(appPath);

  if (!(await isWriteable(path.dirname(root)))) {
    console.error(
      "The application path is not writable, please check folder permissions and try again.",
    );
    console.error(
      "It is likely you do not have write permissions for this folder.",
    );
    process.exit(1);
  }

  const appName = path.basename(root);

  await makeDir(root);
  if (!isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  const useYarn = packageManager === "yarn";
  const isOnline = !useYarn || (await getOnline());
  const originalDirectory = process.cwd();

  console.log(`Creating a new thirdweb app in ${chalk.green(root)}.`);
  console.log();

  process.chdir(root);

  function isErrorLike(err: unknown): err is { message: string } {
    return (
      typeof err === "object" &&
      err !== null &&
      typeof (err as { message?: unknown }).message === "string"
    );
  }

  if (template) {
    /**
     * If a template repository is provided, clone it.
     */
    try {
      console.log(
        `Downloading files from repo ${chalk.cyan(
          template,
        )}. This might take a moment.`,
      );
      console.log();
      await retry(
        () => downloadAndExtractRepo(root, { name: template, filePath: "" }),
        {
          retries: 3,
        },
      );
    } catch (reason) {
      throw new DownloadError(
        isErrorLike(reason) ? reason.message : reason + "",
      );
    }

    console.log("Installing packages. This might take a couple of minutes.");
    console.log();

    await install(root, null, { packageManager, isOnline });
    console.log();
  } else if (framework) {
    /**
     * If a framework is provided, clone it.
     */
    try {
      console.log(
        `Downloading files with framework ${chalk.cyan(
          framework,
        )}. This might take a moment.`,
      );
      await retry(
        () =>
          downloadAndExtractRepo(root, { name: frameworkPath, filePath: "" }),
        {
          retries: 3,
        },
      );
    } catch (reason) {
      throw new DownloadError(
        isErrorLike(reason) ? reason.message : reason + "",
      );
    }

    console.log("Installing packages. This might take a couple of minutes.");
    console.log();

    await install(root, null, { packageManager, isOnline });
    console.log();
  }

  if (tryGitInit(root)) {
    console.log("Initialized a git repository.");
    console.log();
  }

  let cdpath: string;
  if (path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  let startOrDev: string | undefined;
  if (framework && (framework === "next" || framework === "vite")) {
    startOrDev = "dev";
  } else if (template) {
    startOrDev = await getStartOrDev(template);
  }

  console.log(`${chalk.green("Success!")} Created ${appName} at ${appPath}`);
  console.log("Inside that directory, you can run several commands:");
  console.log();

  if (startOrDev) {
    console.log(
      chalk.cyan(
        `  ${packageManager} ${
          useYarn || startOrDev === "start" ? "" : "run "
        }${startOrDev}`,
      ),
    );
    console.log("    Starts the development server.");
    console.log();
    console.log(
      chalk.cyan(
        `  ${packageManager} ${
          useYarn || startOrDev === "start" ? "" : "run "
        }build`,
      ),
    );
    console.log("    Builds the app for production.");
    console.log();
  }

  console.log("We suggest that you begin by typing:");
  console.log();
  console.log(chalk.cyan("  cd"), cdpath);

  if (startOrDev) {
    console.log(
      `  ${chalk.cyan(
        `${packageManager} ${
          useYarn || startOrDev === "start" ? "" : "run "
        }${startOrDev}`,
      )}`,
    );
  }
  console.log();
}
