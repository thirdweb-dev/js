// import { ThirdwebStorage } from "@thirdweb-dev/storage";
import detectFramework from "../core/detection/detectFramework";
import detectPackageManager from "../core/detection/detectPackageManager";
import { logger } from "../core/helpers/logger";
import { runCommand } from "../create/helpers/run-command";

export async function deployApp(
  distPath = "dist",
  projectPath = ".",
  // secretKey: string,
) {
  // let storage: ThirdwebStorage;
  // if (secretKey) {
  //   storage = new ThirdwebStorage({
  //     secretKey,
  //   });
  // } else {
  //   // Since the auth key is being set in the global context, we don't need to pass anything here.
  //   storage = new ThirdwebStorage();
  // }
  const detectedPackageManager = await detectPackageManager(projectPath, {});
  const detectedFramework = await detectFramework(
    projectPath,
    {},
    detectedPackageManager,
  );

  if (detectedFramework === "none") {
    throw new Error("No supported project detected");
  }

  switch (detectedFramework) {
    case "next":
      distPath = "out";
      break;
    case "cra":
      distPath = "build";
      break;
    default:
      break;
  }

  logger.info(`Detected project type: ${detectedFramework}`);
  logger.info(`Detected package manager: ${detectedPackageManager}`);
  logger.info(`distPath: ${distPath}`);
  logger.info(`projectPath: ${projectPath}`);

  try {
    switch (detectedPackageManager) {
      case "yarn":
        await runCommand("yarn", ["build"], true);
        if (detectedFramework === "next") {
          await runCommand("yarn", ["next", "export"], true);
        }
        break;
      case "npm":
        await runCommand("npm", ["run", "build"], true);
        if (detectedFramework === "next") {
          await runCommand("npx", ["next", "export"], true);
        }
        break;
      case "pnpm":
        await runCommand("pnpm", ["build"], true);
        if (detectedFramework === "next") {
          await runCommand("pnpm", ["next", "export"], true);
        }
        break;
      default:
        throw new Error("No supported package manager detected");
    }
  } catch (err) {
    console.error("Can't build project");
    return Promise.reject("Can't build project");
  }

  try {
    // TODO fix this
    // const uri = await upload(storage, distPath);
    // return `${uri.replace("ipfs://", "https://cf-ipfs.com/ipfs/")}`;
    return "";
  } catch (err: any) {
    console.error(err.message ? err.message : err);
    return Promise.reject("Can't upload project");
  }
}
