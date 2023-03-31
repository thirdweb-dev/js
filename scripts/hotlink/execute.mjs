import { exec } from "child_process";

/**
 *
 * @param {string[]} commands
 * @returns
 */
export const execute = (commands) => {
  return new Promise((res) => {
    exec(commands.join("\n"), (err, stdout, stderr) => {
      if (err) {
        throw err;
      }

      if (stderr) {
        console.error(stderr);
        console.log("\n");
      }
      res();
    });
  });
};
