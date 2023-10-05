import { updateCheck } from "./update-check";
import { version } from "../../package.json";
import chalk from "chalk";
import gradient from "gradient-string";
import { logger } from "./logger";

const twGradient = gradient(["#F213A4", "#5204BF"]);

export async function printCLIBanner() {
  // don't print in test environment
  if (typeof jest !== "undefined") {
    return;
  }

  let text = ` thirdweb ${version} `;
  const maybeNewVersion = await updateCheck();
  if (maybeNewVersion !== undefined) {
    text += ` (update available ${chalk.green(maybeNewVersion)})`;
  }

  const supportsColor = (await import("supports-color")).default;

  logger.log(
    text +
      "\n" +
      (supportsColor.stdout
        ? twGradient("-".repeat(text.length))
        : "-".repeat(text.length)),
  );

  // Log a slightly more noticeable message if this is a major bump
  if (maybeNewVersion !== undefined) {
    const currentMajor = parseInt(version.split(".")[0]);
    const newMajor = parseInt(maybeNewVersion.split(".")[0]);
    if (newMajor > currentMajor) {
      logger.warn(
        `The version of the thirdweb CLI you are using is now out-of-date.
Please update to the latest version to prevent critical errors.
Run \`npm install --save-dev thirdweb@${newMajor}\` to update to the latest version.
After installation, run the thirdweb CLI with \`npx thirdweb\`.`,
      );
    }
  }
}
