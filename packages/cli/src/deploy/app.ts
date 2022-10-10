import NPMDetector from "../core/detection/npm";
import ViteDetector from "../core/detection/vite";
import YarnDetector from "../core/detection/yarn";
import { runCommand } from "../create/helpers/run-command";
import { upload } from "../storage/command";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

type AppOptions = {
  path?: string;
};

export async function deployApp({ path = "dist" }: AppOptions) {
  const storage = new ThirdwebStorage();

  const supportedFrameworks = [new ViteDetector()];

  const possibleProjects = supportedFrameworks
    .filter((detector) => detector.matches(path))
    .map((detector) => detector.projectType);

  const hasYarn = new YarnDetector().matches(".");
  const hasNPM = new NPMDetector().matches(".");

  if (possibleProjects.length === 0) {
    throw new Error("No supported project detected");
  }

  try {
    if (hasYarn) {
      console.log("yarn");
      //run yarn-buld
      await runCommand("yarn", ["build"]);
    } else if (hasNPM) {
      await runCommand("npm", ["build"]);
    }
  } catch (err) {
    console.error("Can't build project");
    return Promise.reject("Can't build project");
  }

  const uri = await upload(storage, path);
  return uri;
}
