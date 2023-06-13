import { generate } from "../generate/command";
import { detectProject } from "../common/project-detector";
import { runDevEnv } from "./utils";

export async function dev(projectPath = { path: "." }, options: any) {

  // Run detection.
  const detections = await detectProject(options);
  // Run generate command.
  await generate({ path: projectPath.path, logs: false });
  // Run dev command.
  await runDevEnv(detections, projectPath);

  return Promise.resolve("Running dev server");
}
