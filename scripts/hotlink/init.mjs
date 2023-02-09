// @ts-check
import { changes } from "./changes.mjs";
import { unlink } from "./utils.mjs";
import { banner } from "./utils.mjs";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

/**
 * update the package.json files
 * replace references of builds with source files
 */
function updatepackageJsonFiles() {
  const originalFiles = [];

  changes.forEach((change) => {
    const file = fs.readFileSync(path.join(process.cwd(), change.path), "utf8");
    const packageJson = JSON.parse(file);

    originalFiles.push(file);

    packageJson.main = change.entry;
    packageJson.module = change.entry;

    // prevent accidental publishing
    packageJson.private = true;

    for (const key in change.exports) {
      packageJson.exports[key].module = change.exports[key];
    }

    fs.writeFileSync(
      path.join(process.cwd(), change.path),
      JSON.stringify(packageJson, null, 2),
    );

    // save the original file next to it with the name 'package.json.original'
    fs.writeFileSync(path.join(process.cwd(), change.path + ".original"), file);
  });
}

/**
 * Create symlinks for the packages
 * @returns {Promise<void>}
 */
function createLinks() {
  const createSymLinks = [
    // react
    "cd packages/react",
    "sudo yarn link",
    "cd ../../",
    // react-core
    "cd packages/react-core",
    "sudo yarn link",
    "cd ../../",
    // sdk
    "cd packages/sdk",
    "sudo yarn link",
  ].join("\n");

  return new Promise((res) => {
    exec(createSymLinks, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        return;
      }

      if (stderr) console.error(stderr);
      res();
    });
  });
}

/**
 * create a new file 'HOTLINK.md' at root and open it in vscode
 */
function createAndOpenHotLinkMd() {
  // create a new file 'HOTLINK.md' at root with text "in hotlink mode"
  // copy HOTLINK.md file from scripts/hotlink/HOTLINK.md to root
  fs.copyFileSync(
    path.join(process.cwd(), "scripts/hotlink/HOTLINK.md"),
    path.join(process.cwd(), "HOTLINK.md"),
  );

  // open the HOTLINK.md in vscode
  exec("code ./HOTLINK.md");
}

async function script() {
  banner();
  updatepackageJsonFiles();

  // package json files updated in green with check mark
  console.log(`\x1b[32m%s\x1b[0m`, `✅ Package.json Files updated `);

  await unlink();
  await createLinks();

  // symlinks created in green with check mark
  console.log(`\x1b[32m%s\x1b[0m`, `✅ Symlinks Created `);

  createAndOpenHotLinkMd();

  // happy hacking message with emoji in blue
  console.log(`\n\n🚀 Hotlink complete. Happy Hacking :)  \n\n`);
}

script();
