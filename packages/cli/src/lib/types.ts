import { FrameworkType, PackageManagerType } from "../core/types/ProjectType";

export type IProcessContractAppTypeArgs = {
  detectedPackageManager: PackageManagerType;
  thirdwebDepsToUpdate: Set<string>;
  thirdwebDepsToInstall: Set<string>;
  isJSPackageManager: boolean;
}

export type IProcessAppTypeArgs = {
  detectedFramework: FrameworkType;
  thirdwebDepsToUpdate: Set<string>;
  thirdwebDepsToInstall: Set<string>;
  isJSPackageManager: boolean;
  isPythonPackageManager: boolean;
  isGoPackageManager: boolean;
  hasEthers: boolean;
  otherDeps: Set<string>;
}
