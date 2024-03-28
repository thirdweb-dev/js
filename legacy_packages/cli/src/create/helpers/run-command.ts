import { spawn } from "cross-spawn";

export async function runCommand(
  command: string,
  args: string[],
  logging: boolean = false,
  onData?: (data: any) => void,
) {
  return new Promise<void>((resolve, reject) => {
    /**
     * Spawn the installation process.
     */
    const child = spawn(command, args);

    child.stdout?.on("data", (data) => {
      if (onData) {
        onData(data);
      }
      if (logging) {
        console.log(data.toString());
      }
    });

    child.stderr?.on("data", (data) => {
      if (logging) {
        console.error(data.toString());
      }
    });

    child.on("error", (err) => {
      console.log("Spawn error", err);
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject({ command: `${command}`, exitCode: code });
        return;
      }
      resolve();
    });
  });
}
