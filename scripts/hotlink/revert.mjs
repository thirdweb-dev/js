import { banner, unlink } from "./utils.mjs";
import fs from "fs";
import path from "path";

// undo the changes done by the hotlink script

function restorePackageJsonFiles() {
  const modifiedPackageJSONFilePaths = [
    "/packages/react/package.json",
    "/packages/react-core/package.json",
    "/packages/sdk/package.json",
  ];

  // replace each package.json files with the original package.json.original file
  // and remove the package.json.original file

  modifiedPackageJSONFilePaths.forEach((filePath) => {
    const originalFilePath = `${filePath}.original`;
    // replace the modified package.json file with the original package.json.original file
    try {
      fs.renameSync(
        path.join(process.cwd(), originalFilePath),
        path.join(process.cwd(), filePath),
      );
    } catch (e) {
      // console.error(e);
    }
  });
}

async function script() {
  banner();

  await unlink();

  // symlinks removed in green with checkmark
  console.log("\x1b[32m%s\x1b[0m", "✅ Symlinks Removed");

  restorePackageJsonFiles();

  console.log("\x1b[32m%s\x1b[0m", "✅ Package.json Files Restored\n");

  // remove ./HOTLINK.md file
  try {
    fs.unlinkSync(path.join(process.cwd(), "./HOTLINK.md"));
  } catch (e) {
    // console.error(e);
  }

  console.log(
    "\x1b[33m%s\x1b[0m",
    "👇 Run 'yarn --force' to restore packages from NPM\n\n",
  );
}

script();
