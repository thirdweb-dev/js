import { exec } from "child_process";

export async function execute(
  command: string,
  projectPath: string,
  options = { log: false, cwd: projectPath },
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((done, failed) => {
    exec(command, { ...options }, (err, stdout, stderr) => {
      if (err) {
        failed(err);
        return;
      }

      done({ stdout, stderr });
    });
  });
}
