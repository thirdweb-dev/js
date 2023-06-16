import inquirer from 'inquirer';
import { generate } from "../generate/command";
import { detectProject } from "../common/project-detector";
import { runDev } from "./utils";
import ora from 'ora';

export async function dev(options: any) {
  let mobilePlatform: "ios" | "android" = "ios";

  // Run detection.
  const detections = await detectProject(options);

  // Run generate command. Only generate ABIs for JS projects for now, will add Python and Go.
  if (["npm", "yarn", "pnpm"].includes(detections.detectedPackageManager)) {
    await generate({ path: options.path });
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
    await runDev(detections, options, mobilePlatform);
  } catch (error) {
    ora(`${error}`).fail();
  }
}
