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
    "cd packages/thirdweb",
    "pnpm link",
    "cd ../react",
    "cd packages/react",
    "pnpm link",
    "cd ../react-core",
    "pnpm link",
    "cd ../wallets",
    "pnpm link",
    "cd ../..",
  ]);

  // use react-core and wallets link in react package
  await execute([
    "cd packages/react",
    "pnpm link @thirdweb-dev/react-core",
    "pnpm link @thirdweb-dev/wallets",
    "cd ../..",
  ]);

  // done
  console.log("\x1b[32m%s\x1b[0m", "\nHotlink Complete ✨\n\n");

  // how to use hot-linked packages
  console.log(
    "\x1b[33m%s\x1b[0m",
    "Run Below Commands to use Hotlinked pacakges in your project:\n",
  );
  console.log("\x1b[33m%s\x1b[0m", "pnpm link @thirdweb-dev/react");
  console.log("\x1b[33m%s\x1b[0m", "pnpm --force");
  console.log("\n");

  console.log(
    "--------------------------------------------------------------------------------\n",
  );

  console.log(
    "You will also need to configure your build tool to build the linked packages.\n",
  );
  console.log("For Vite: configure `optimizeDeps` in `vite.config.js`\n");
  // hello in blue
  console.log(
    "\x1b[33m%s\x1b[0m",
    `\
optimizeDeps: {
  exclude: ['@thirdweb-dev/react'],
}\n\n`,
  );

  console.log(
    "for Next.js configure `transpilePackages` in `next.config.js`\n",
  );

  console.log(
    "\x1b[33m%s\x1b[0m",
    `\
const nextConfig = {
  transpilePackages: ['@thirdweb-dev/react'],
};\n\n`,
  );

  console.log(
    "--------------------------------------------------------------------------------\n",
  );

  // how to revert
  console.log(
    "\x1b[35m%s\x1b[0m",
    "Run `pnpm hotlink-revert` to revert hot-linking\n",
  );

  // clear cache notice
  console.log(
    "Make sure to clear cache in your project and restart TS server in VSCode before starting dev server in your project\n",
  );
}

script();
