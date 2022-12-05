import { exec } from "child_process";

export async function hasForge() {
  // eslint-disable @typescript-eslint/no-unused-vars
  return await new Promise((resolve, _reject) => {
    // eslint-disable @typescript-eslint/no-unused-vars
    exec("forge --version", (error, _stdout, _stderr) => {
      if (error) {
        resolve(false);
      }
      resolve(true);
    });
  });
}
