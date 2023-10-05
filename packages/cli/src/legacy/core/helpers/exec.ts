import { exec } from "child_process";

export async function execute(
  command: string,
  projectPath: string,
  options = { log: false, cwd: projectPath },
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(command, { ...options }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({ stdout, stderr });
    });
  });
}
