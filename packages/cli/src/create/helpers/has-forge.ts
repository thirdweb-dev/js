import { exec } from "child_process";

export async function hasForge() {
  return await new Promise((resolve) => {
    exec("forge --version", (error) => {
      resolve(!error);
    });
  });
}
