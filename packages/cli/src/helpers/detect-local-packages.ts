import { exec } from "child_process";

export async function detectLocalPackages(): Promise<string[]> {
  return new Promise((resolve) => {
    exec("npm ls --depth=0", (err, stdout) => {
      var packages: string[] = [];
      packages = stdout.split("\n");
      packages = packages.filter(function (item) {
        if (item.match(/^├──.+/g) !== null) {
          return true;
        }
        if (item.match(/^└──.+/g) !== null) {
          return true;
        }
        return undefined;
      });
      packages = packages
        .map(function (item) {
          if (item.match(/^├──.+/g) !== null) {
            return item.replace(/^├──\s/g, "");
          }
          if (item.match(/^└──.+/g) !== null) {
            return item.replace(/^└──\s/g, "");
          }
        })
        .filter((item) => !!item) as string[];
      resolve(packages);
    });
  });
}
