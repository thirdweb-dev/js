import { spawnSync } from "node:child_process";
import type { Ora } from "ora";

export function checkPrerequisites(
  spinner: Ora,
  cmd: string,
  args: string[] = ["--version"],
  name = cmd,
) {
  try {
    const res = spawnSync(cmd, args, { encoding: "utf-8" });

    if (res.error && (res.error as NodeJS.ErrnoException).code === "ENOENT") {
      spinner.fail(
        `Error: ${name} is not installed or not in PATH.\n` +
          `Install it and try again.`,
      );
      process.exit(1);
    }

    if (res.status !== 0) {
      spinner.fail(
        `Error: ${name} returned a non-zero exit code (${res.status}).`,
      );
      process.exit(1);
    }

    const ver = res.stdout.trim().split("\n")[0];
    spinner.succeed(`${name} detected (${ver}).`);
  } catch (err) {
    spinner.fail(`Error while checking ${name}: ${err}`);
    process.exit(1);
  }
}
