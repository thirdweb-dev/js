import { spinner } from "../core/helpers/logger";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import path, { join } from "path";

const ghActionHash = "ipfs://QmVMCdg6Jrro4GdySCVhvopwruxKdSgXJmYWA9mH9QjP3F";

export async function installGithubAction(options: any) {
  let projectPath = process.cwd();
  if (options.path) {
    const resolvedPath = (options.path as string).startsWith("/")
      ? options.path
      : path.resolve(`${projectPath}/${options.path}`);
    projectPath = resolvedPath;
  }
  const storage = new ThirdwebStorage();
  const log = spinner("Installing thirdweb Github Action...");
  try {
    const ghActionData = await (await storage.download(ghActionHash)).text();
    const dir = join(projectPath, ".github/workflows");
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(`${dir}/thirdweb.yml`, ghActionData);
    log.succeed(
      "thirdweb Github Action installed. Commit and push to the main GitHub branch to activate it.",
    );
  } catch (e) {
    log.fail(`Failed to install Github Action.\n\n${e}`);
  }
}
