import { exec } from "child_process";

export async function hasForge() {
  return await new Promise((resolve, _reject) => {
    exec("forge --version", (error, _stdout, _stderr) => {
      if (error) {
        resolve(false);
      }
      resolve(true);
    });
  });
}
