/* eslint-disable import/no-extraneous-dependencies */
import { runCommand } from "./run-command";
import chalk from "chalk";
import path from "path";

/**
 * Check if CocoaPods is installed and run `pod install` if it is.
 *
 * @returns A Promise that resolves once the installation is finished.
 */
export function podInstall(root: string, isOnline: boolean): Promise<void> {
  /**
   * Return a Promise that resolves once the installation is finished.
   */
  return new Promise(async (resolve, reject) => {
    if (!isOnline) {
      console.log(chalk.yellow("You appear to be offline."));
      console.log();
      reject();
    }

    try {
      await runCommand("bundle", ["install"], true);
    } catch (error) {
      reject(error);
    }

    console.log("Running pod install...");
    try {
      process.chdir(path.join(root, "ios"));
      await runCommand("pod", ["install"], true);
      process.chdir(root);
      resolve();
    } catch (error) {
      process.chdir(root);
      reject(error);
    }
  });
}
