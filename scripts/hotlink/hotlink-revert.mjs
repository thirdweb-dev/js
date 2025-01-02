// @ts-check
import { banner } from "./banner.mjs";
import { updatePackages } from "./changes.mjs";
import { execute } from "./execute.mjs";

async function script() {
  console.log(banner);
  const isLegacy = process.argv[2] === "legacy";

  console.log("\x1b[34m%s\x1b[0m", "Reverting package json files");
  updatePackages("original", isLegacy);

  console.log("\x1b[34m%s\x1b[0m", "Removing Symlinks");

  if (isLegacy) {
    await execute([
      "cd legacy_packages/react",
      "pnpm unlink",
      "cd ../react-core",
      "pnpm unlink",
      "cd ../wallets",
      "pnpm unlink",
      "cd ../..",
    ]);
  } else {
    await execute(["cd packages/thirdweb", "pnpm unlink"]);
  }

  console.log("\x1b[32m%s\x1b[0m", "\nHotlink Reverted\n\n");
}

script();
