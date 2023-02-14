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
    "cd ../../",
    // clear symlinks on root
    "sudo yarn unlink @thirdweb-dev/react-core",
    "sudo yarn unlink @thirdweb-dev/react",
    "sudo yarn unlink @thirdweb-dev/sdk",
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
