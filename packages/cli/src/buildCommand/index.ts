import { generate } from "../generate/command";
import { detectProject } from "../common/project-detector";
import { runBuild } from "./utils";
import ora from "ora";
import { detectExtensions } from "../common/feature-detector";

export async function build(options: any) {
  // Run detection.
  const detections = await detectProject(options);

  if (detections.detectedAppType === "contract") {
    try {
      await detectExtensions(options);
    } catch (error) {
      ora(`${error}`).fail();
    }
  } else {
    // Run generate command. Only generate ABIs for JS projects for now, will add Python and Go.
    if (["npm", "yarn", "pnpm"].includes(detections.detectedPackageManager)) {
      ora("Fetching ABIs and optimizing contracts found...").info();
      await generate({ path: options.path });
      ora("ABIs generated successfully!").succeed();
    }
    if (!options.debug) {
      ora("Building project...").start();
    }
    try {
      await runBuild(detections, options);
      ora("Project built successfully!").succeed();
    } catch (error) {
      ora(`${error}`).fail();
    }
  }
}
