import spawn from "cross-spawn";

export async function runCommand(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    /**
     * Spawn the installation process.
     */
    const child = spawn(command, args);
    child.on("close", (code) => {
      if (code !== 0) {
        reject({ command: `${command}` });
        return;
      }
      resolve();
    });
  });
}
