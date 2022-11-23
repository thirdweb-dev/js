import spawn from "cross-spawn";

export async function runCommand(
  command: string,
  args: string[],
  logging: boolean = false,
) {
  return new Promise<void>((resolve, reject) => {
    /**
     * Spawn the installation process.
     */
    const child = spawn(command, args);
    child.stdout?.on("data", (data) => {
      if (logging) {
        console.log(data.toString());
      }
    });

    child.stderr?.on("error", (err) => {
      if (logging) {
        console.error(err);
      }
    });
    child.on("close", (code) => {
      if (code !== 0) {
        reject({ command: `${command}` });
        return;
      }
      resolve();
    });
  });
}
