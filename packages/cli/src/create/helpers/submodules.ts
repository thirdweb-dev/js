/* eslint-disable import/no-extraneous-dependencies */
import { runCommand } from "./run-command";
import { rm, writeFile } from "node:fs/promises";

/**
 * Spawn a package manager installation with either Yarn or NPM.
 *
 * @returns A Promise that resolves once the installation is finished.
 */
export async function submodules(): Promise<void> {
  // Remove script folder because it clashes with contract templates (and not needed with deploy)
  await rm("script", { recursive: true, force: true });

  // Reset and recursively add forge submodules
  await rm(".gitmodules", { recursive: true, force: true });
  await rm("lib", { recursive: true, force: true });
  await writeFile(".gitmodules", "");
  await runCommand("git", [
    "submodule",
    "add",
    "https://github.com/foundry-rs/forge-std.git",
    "lib/forge-std",
  ]);
  await runCommand("git", ["submodule", "update", "--init", "--recursive"]);
}
