/* eslint-disable import/no-extraneous-dependencies */
import { runCommand } from "./run-command";

const MIN_SUPPORTED_RUBY_VERSION = "2.6";

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
        if (version < MIN_SUPPORTED_RUBY_VERSION) {
          console.error(
            `Your current ruby version is not supported by this project: ${version}`,
          );
          console.error(
            `Please, set your ruby version to at least ${MIN_SUPPORTED_RUBY_VERSION} and try again.`,
          );
          process.exit(1);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
