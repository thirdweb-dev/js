// @ts-check
import { banner } from "./banner.mjs";
import { updatePackages } from "./changes.mjs";
import { execute } from "./execute.mjs";

async function script() {
  console.log(banner);

  console.log("\x1b[34m%s\x1b[0m", "Updating package json files");
  updatePackages("hotlink");

  console.log("\x1b[34m%s\x1b[0m", "Creating Symlinks");
  await execute([
    "cd packages/react",
    "yarn link",
    "cd ../react-core",
    "yarn link",
    "cd ../wallets",
    "yarn link",
    "cd ../..",
  ]);

  // use react-core and wallets link in react package
  await execute([
    "cd packages/react",
    "yarn link @thirdweb-dev/react-core",
    "yarn link @thirdweb-dev/wallets",
    "cd ../..",
  ]);

  // done
  console.log("\x1b[32m%s\x1b[0m", "\nHotlink Complete ✨\n\n");

  // how to use hot-linked packages
  console.log(
    "\x1b[33m%s\x1b[0m",
    "Run Below Commands to use Hotlinked pacakges in your project:\n",
  );
  console.log("\x1b[33m%s\x1b[0m", "yarn link @thirdweb-dev/react");
  console.log("\x1b[33m%s\x1b[0m", "yarn link @thirdweb-dev/react-core");
  console.log("\x1b[33m%s\x1b[0m", "yarn link @thirdweb-dev/wallets");
  console.log("\n");

  // how to revert
  console.log(
    "\x1b[35m%s\x1b[0m",
    "Run `yarn hotlink-revert` to revert hot-linking\n",
  );

  // clear cache notice
  console.log(
    "Make sure to clear cache in your project and restart TS server in VSCode before starting dev server in your project\n",
  );
}

script();
