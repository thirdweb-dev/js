/* eslint-disable import/no-extraneous-dependencies */
import { runCommand } from "./run-command";
import fs from "fs";
import path from "path";

/**
 * Checks if the current ruby version is supported by the project.
 *
 * @returns A Promise that resolves once the ruby version is checked. True if it changed, false otherwise.
 */
export function setRubyVersion(root: string): Promise<boolean> {
  /**
   * Return a Promise that resolves once the installation is finished.
   */
  return new Promise(async (resolve, reject) => {
    try {
      await runCommand("ruby", ["-v"], false, (dataBfr) => {
        const data = String(dataBfr);
        const systemVersion = data.split(" ")[1];

        let rubyVersionFile = path.join(root, ".ruby-version");
        let rubyProjectVersionString = "";

        try {
          rubyProjectVersionString = String(fs.readFileSync(rubyVersionFile));
        } catch (error) {
          rubyVersionFile = path.join(root, "_ruby-version");
          rubyProjectVersionString = String(fs.readFileSync(rubyVersionFile));
        }

        try {
          if (systemVersion.includes(rubyProjectVersionString)) {
            // same version, no need to update
            resolve(false);
          } else {
            const systemVersionWithoutPatch = systemVersion.split("p")[0];
            fs.writeFileSync(rubyVersionFile, systemVersionWithoutPatch);
            resolve(true);
          }
        } catch (e) {
          console.log(
            "Failed to update ruby version. Please, set your ruby version to a minimum of 2.6 and try again.",
          );
          console.log();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
