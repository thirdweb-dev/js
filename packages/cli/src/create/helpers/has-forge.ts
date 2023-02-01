import { exec } from "child_process";

export async function hasForge() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return await new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exec("forge --version", (error, stdout, stderr) => {
      if (error) {
        resolve(false);
      }
      resolve(true);
    });
  });
}
