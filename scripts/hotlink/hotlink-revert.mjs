// @ts-check
import { banner } from "./banner.mjs";
import { updatePackages } from "./changes.mjs";
import { execute } from "./execute.mjs";

async function script() {
  console.log(banner);

  console.log("\x1b[34m%s\x1b[0m", "Reverting package json files");
  updatePackages("original");

  console.log("\x1b[34m%s\x1b[0m", "Removing Symlinks");
  await execute([
    "cd packages/react",
    "pnpm unlink",
    "cd ../react-core",
    "pnpm unlink",
    "cd ../wallets",
    "pnpm unlink",
    "cd ../..",
  ]);

  console.log("\x1b[32m%s\x1b[0m", "\nHotlink Reverted\n\n");
}

script();
