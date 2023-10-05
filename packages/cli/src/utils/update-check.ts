import checkForUpdate from "update-check";
import pkg from "../../package.json";
import type { Result } from "update-check";

function determineDistTag(version: string) {
  if (version.startsWith("0.0.0")) {
    if (version.includes("nightly")) {
      return "nightly";
    } else if (version.includes("next")) {
      return "next";
    }
    return "dev";
  }
  return "latest";
}

export async function updateCheck(): Promise<string | undefined> {
  let update: Result | null = null;
  try {
    // default cache for update check is 1 day
    update = await checkForUpdate(pkg, {
      distTag: determineDistTag(pkg.version),
    });
  } catch (err) {
    // ignore error
  }
  return update?.latest;
}
