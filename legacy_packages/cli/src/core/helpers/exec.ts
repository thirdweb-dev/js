import { exec } from "child_process";

export async function execute(
  command: string,
  projectPath: string,
  options = { log: false, cwd: projectPath },
  timeout = 1_200_000, // 20 minute timeout by default
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const process = exec(command, { ...options }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      clearTimeout(timeoutId);
      resolve({ stdout, stderr });
    });

    const timeoutId = setTimeout(() => {
      process.kill();
      reject(new Error("Command timeout"));
    }, timeout);
  });
}
