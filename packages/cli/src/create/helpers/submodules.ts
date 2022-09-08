/* eslint-disable import/no-extraneous-dependencies */
import { runCommand } from "./run-command";

/**
 * Spawn a package manager installation with either Yarn or NPM.
 *
 * @returns A Promise that resolves once the installation is finished.
 */
export async function submodules(): Promise<void> {
  // Remove script folder because it clashes with contract templates (and not needed with deploy)
  await runCommand("rm", ["-rf", "script"]);

  // Reset and recursively add forge submodules
  await runCommand("rm", ["-rf", ".gitmodules"]);
  await runCommand("rm", ["-rf", "lib"]);
  await runCommand("touch", [".gitmodules"]);
  await runCommand("git", [
    "submodule",
    "add",
    "https://github.com/foundry-rs/forge-std.git",
    "lib/forge-std",
  ]);
  await runCommand("git", ["submodule", "update", "--init", "--recursive"]);
}
