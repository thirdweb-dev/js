import { generate } from "../generate/command";
import { detectProject } from "../common/project-detector";
import { runDevEnv } from "./utils";

export async function dev(projectPath = { path: "." }, options: any) {

  // Run detection.
  const detections = await detectProject(options);
  // Run generate command. Only generate ABIs for JS projects for now, will add Python and Go.
  if (["npm", "yarn", "pnpm"].includes(detections.detectedPackageManager)) {
    await generate({ path: projectPath.path });
  }
  // Run dev command.
  await runDevEnv(detections, projectPath);

  return Promise.resolve("Running dev server");
}
