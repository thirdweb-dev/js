import detectPackageManager from "../core/detection/detectPackageManager";
import detectFramework from "../core/detection/detectFramework";
import detectLibrary from "../core/detection/detectLibrary";
import { logger } from "../core/helpers/logger";
import path from "path";

export async function detectProjectV2(options: any) {
  logger.setSettings({
    minLevel: options.debug ? "debug" : "info",
  });

  let projectPath = process.cwd();
  if (options.path) {
    logger.debug("Overriding project path to " + options.path);

    const resolvedPath = (options.path as string).startsWith("/")
      ? options.path
      : path.resolve(`${projectPath}/${options.path}`);
    projectPath = resolvedPath;
  }

  logger.debug("Processing project at path " + projectPath);

  const detectedPackageManager = await detectPackageManager(projectPath, options);
  const detectedLibrary = await detectLibrary(projectPath, options);
  // const detectedLanguage = await detectLanguage(projectPath, options);
  const detectedFramework = await detectFramework(projectPath, options);

  logger.debug("Detected package manager " + detectedPackageManager);
  logger.debug("Detected library " + detectedLibrary);
  // logger.debug("Detected language " + detectedLanguage);
  logger.debug("Detected framework " + detectedFramework);
}