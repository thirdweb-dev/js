import inquirer from 'inquirer';
import { generate } from "../generate/command";
import { detectProject } from "../common/project-detector";
import { runDev } from "./utils";
import ora from 'ora';

export async function dev(options: any) {
  let mobilePlatform: "ios" | "android" = "ios";

  // Run detection.
  const detections = await detectProject(options);
  if (detections.detectedAppType === "contract") {
    ora("Contracts cannot be run in dev mode. Perhaps you meant to use `thirdweb build`?").fail();
    return;
  }

  // Run generate command. Only generate ABIs for JS projects for now, will add Python and Go.
  if (["npm", "yarn", "pnpm"].includes(detections.detectedPackageManager)) {
    try {
      await generate({ path: options.path, debug: options.debug });
    } catch (error) {
      ora(`${error}`).fail();
    }
  }

  if(detections.detectedFramework === "expo" || detections.detectedFramework === "react-native-cli") {
    try {
      const answer = await inquirer.prompt({
        type: "list",
        name: "platform",
        message: "Which platform would you like to run?",
        choices: ["ios", "android"],
      });
      mobilePlatform = answer.platform;
    } catch (error) {
      console.log(error);
    }
  }

  try {
    // Run dev command.
    ora("Starting dev server...").info();
    await runDev(detections, options, mobilePlatform);
  } catch (error) {
    ora(`${error}`).fail();
  }
}
