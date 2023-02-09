// @ts-check
import { exec } from "child_process";

/**
 *
 * @returns {Promise<void>}
 */
export function unlink() {
  const unlink = [
    // react
    "cd packages/react",
    "sudo yarn unlink",
    "cd ../../",
    // react-core
    "cd packages/react-core",
    "sudo yarn unlink",
    "cd ../../",
    // sdk
    "cd packages/sdk",
    "sudo yarn unlink",
  ].join("\n");

  return new Promise((res) => {
    exec(unlink, (err, stdout, stderr) => {
      res();
    });
  });
}

/**
 * Show a banner in the terminal
 */
export function banner() {
  console.log(`\

██╗  ██╗ ██████╗ ████████╗██╗     ██╗███╗   ██╗██╗  ██╗
██║  ██║██╔═══██╗╚══██╔══╝██║     ██║████╗  ██║██║ ██╔╝
███████║██║   ██║   ██║   ██║     ██║██╔██╗ ██║█████╔╝
██╔══██║██║   ██║   ██║   ██║     ██║██║╚██╗██║██╔═██╗
██║  ██║╚██████╔╝   ██║   ███████╗██║██║ ╚████║██║  ██╗
╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝

`);

  // same as above, but in red
}
