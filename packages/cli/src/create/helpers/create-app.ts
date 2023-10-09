/* eslint-disable import/no-extraneous-dependencies */
import { checkRubyVersion } from "./check-ruby-version";
import type { PackageManager } from "./get-pkg-manager";
import { getStartOrDev } from "./get-start-or-dev";
import { tryGitInit } from "./git";
import { install } from "./install";
import { isFolderEmpty } from "./is-folder-empty";
import { getOnline } from "./is-online";
import { isWriteable } from "./is-writeable";
import { makeDir } from "./make-dir";
import { podInstall } from "./pod-install";
import { downloadAndExtractRepo, hasTemplate } from "./templates";
import retry from "async-retry";
import chalk from "chalk";
import fs from "fs";
import os from "os";
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

  const isReactNative =
    template?.includes("react-native") || framework === "react-native";
  function isReactNativeCLI() {
    return (
      isReactNative &&
      (language === "typescript" || (template && !template.includes("expo")))
    );
  }

  function isMacOS() {
    return process.platform === "darwin";
  }

  if (isReactNativeCLI() && isMacOS()) {
    // fail early if the user doesn't have the right version of Ruby installed on macOS
    await checkRubyVersion();
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
        isErrorLike(reason) ? reason.message : String(reason),
      );
    }

    const jsonFile = path.join(root, "package.json");
    const packageString = fs.readFileSync(jsonFile);
    try {
      const packageJson = JSON.parse(packageString.toString());
      if (packageJson) {
        packageJson.name = appName;
      }

      fs.writeFileSync(jsonFile, JSON.stringify(packageJson, null, 2) + os.EOL);
    } catch (e) {
      console.log("Failed to re-name package.json, continuing...");
      console.log();
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
        isErrorLike(reason) ? reason.message : String(reason),
      );
    }

    try {
      const jsonFile = path.join(root, "package.json");
      const packageString = fs.readFileSync(jsonFile);
      const packageJson = JSON.parse(packageString.toString());
      if (packageJson) {
        packageJson.name = appName;
      }

      fs.writeFileSync(jsonFile, JSON.stringify(packageJson, null, 2) + os.EOL);
    } catch (e) {
      console.log("Failed to re-name package.json, continuing...");

      console.log();
    }

    console.log("Installing packages. This might take a couple of minutes.");
    console.log();

    await install(root, null, { packageManager, isOnline });
    console.log();
  }

  if (isReactNativeCLI() && isMacOS()) {
    await podInstall(root, isOnline);
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
  if (framework && (framework.includes("next") || framework.includes("vite"))) {
    startOrDev = "dev";
  } else if (template) {
    startOrDev = await getStartOrDev(template);
  }

  console.log(`${chalk.green("Success!")} Created ${appName} at ${appPath}`);
  console.log("Inside that directory, you can run several commands:");
  console.log();

  if (isReactNative) {
    console.log(
      chalk.cyan(
        `  ${packageManager}${
          useYarn || startOrDev === "start" ? "" : "run "
        } android`,
      ),
    );
    console.log("    Runs your app on an Android emulator or device.");
    console.log();
    console.log(
      chalk.cyan(
        `  ${packageManager}${
          useYarn || startOrDev === "start" ? "" : "run "
        } ios`,
      ),
    );
    console.log("    Runs your app on an iOS emulator or device.");
    console.log();
  } else if (startOrDev) {
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

  if (startOrDev && !isReactNative) {
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
