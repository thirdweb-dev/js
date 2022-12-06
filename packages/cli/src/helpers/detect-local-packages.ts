import { exec } from "child_process";

// For LOCAL packages, npm ls picks up things installed by yarn and pnpm too
export async function detectLocalPackages(): Promise<string[]> {
  return detectPackages("npm ls --depth=0");
}

// But for GLOBAL packages, we need to use a separate command for each one
export async function detectGlobalNpmPackages(): Promise<string[]> {
  return detectPackages("npm ls -g --depth=0");
}

export async function detectGlobalYarnPackages(): Promise<string[]> {
  return detectPackages("yarn --cwd `yarn global dir` list");
}

export async function detectGlobalPnpmPackages(): Promise<string[]> {
  return new Promise((resolve) => {
    exec(`pnpm list -g --depth=0`, (err, stdout) => {
      var packages: string[] = [];
      packages = stdout.split("dependencies:")[1]?.trim().split("\n") || [];
      packages = packages.map((pkg) => pkg.replace(" ", "@"));
      resolve(packages);
    });
  });
}

async function detectPackages(cmd: string): Promise<string[]> {
  return new Promise((resolve) => {
    exec(cmd, (err, stdout) => {
      var packages: string[] = [];
      packages = stdout.split("\n");
      // We're one short on '-' to support both yarn and npm
      packages = packages.filter(function (item) {
        if (item.match(/^├─.+/g) !== null) {
          return true;
        }
        if (item.match(/^└─.+/g) !== null) {
          return true;
        }
        return undefined;
      });
      packages = packages
        .map(function (item) {
          if (item.match(/^├─.+/g) !== null) {
            return item.replace(/(^├──\s|^├─\s)/g, "");
          }
          if (item.match(/^└─.+/g) !== null) {
            return item.replace(/(^└──\s|^├─\s)/g, "");
          }
        })
        .filter((item) => !!item) as string[];
      resolve(packages);
    });
  });
}
