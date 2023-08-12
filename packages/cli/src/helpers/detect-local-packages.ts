import { exec } from "child_process";

type PackageManager = "npm" | "yarn" | "pnpm";

interface Installation {
  packageManager: PackageManager;
  isGlobal: boolean;
}

export async function findPackageInstallation(): Promise<
  Installation | undefined
> {
  const isLocal = await isInstalledLocally();
  if (isLocal) {
    const packageManager = await import("detect-package-manager").then(
      ({ detect }) => detect(),
    );

    return { packageManager, isGlobal: false };
  }

  const isGlobalNpm = await isInstalledGloballyWithNpm();
  if (isGlobalNpm) {
    return { packageManager: "npm", isGlobal: true };
  }

  const isGlobalYarn = await isInstalledGloballyWithYarn();
  if (isGlobalYarn) {
    return { packageManager: "yarn", isGlobal: true };
  }

  const isGlobalPnpm = await isInstalledGloballyWithPnpm();
  if (isGlobalPnpm) {
    return { packageManager: "pnpm", isGlobal: true };
  }

  return undefined;
}

// For LOCAL packages, npm ls picks up things installed by yarn and pnpm too
async function isInstalledLocally(): Promise<boolean> {
  const packages = await detectPackages("npm ls --depth=0");
  return containsThirdweb(packages || []);
}

// But for GLOBAL packages, we need to use a separate command for each one
async function isInstalledGloballyWithNpm(): Promise<boolean> {
  const packages = await detectPackages("npm ls -g --depth=0");
  return containsThirdweb(packages || []);
}

async function isInstalledGloballyWithYarn(): Promise<boolean> {
  const packages = await detectPackages("yarn --cwd `yarn global dir` list");
  return containsThirdweb(packages || []);
}

async function isInstalledGloballyWithPnpm(): Promise<boolean> {
  const packages: string[] = await new Promise((resolve) => {
    exec(`pnpm list -g --depth=0`, (err, stdout) => {
      let pkgs: string[] = [];
      pkgs = stdout.split("dependencies:")[1]?.trim().split("\n") || [];
      pkgs = pkgs.map((pkg) => pkg.replace(" ", "@"));
      resolve(pkgs);
    });
  });
  return containsThirdweb(packages || []);
}

function containsThirdweb(packages: string[]) {
  return packages.some((pkg) => pkg.match(/^thirdweb/));
}

async function detectPackages(cmd: string): Promise<string[]> {
  return new Promise((resolve) => {
    exec(cmd, (err, stdout) => {
      let packages: string[] = [];
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
