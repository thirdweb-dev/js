/* eslint-disable import/no-extraneous-dependencies */
import { runCommand } from "./run-command";
import chalk from "chalk";

const SUPPORTED_RUBY_VERSION = "2.7.6";

/**
 * Checks if the current ruby version is supported by the project.
 *
 * @returns A Promise that resolves once the ruby version is checked.
 */
export function checkRubyVersion(): Promise<void> {
  /**
   * Return a Promise that resolves once the installation is finished.
   */
  return new Promise(async (resolve, reject) => {
    try {
      await runCommand("ruby", ["-v"], false, (dataBfr) => {
        const data = String(dataBfr);
        const version = data.split(" ")[1];
        if (!version.includes(SUPPORTED_RUBY_VERSION)) {
          console.log();
          console.error(
            `Your current ruby version: ${chalk.red(
              `"${version}"`,
            )}, is not supported by this project.`,
          );
          console.error(
            `Please, set your ruby version to ${chalk.green(
              `"${SUPPORTED_RUBY_VERSION}"`,
            )} and try again.`,
          );
          console.error(
            `For more information, please visit the React Native documentation: https://reactnative.dev/docs/environment-setup#ruby`,
          );
          console.log();
          process.exit(1);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
