import {
  FrameworkType,
  LibraryType,
  PackageManagerType,
} from "../core/types/ProjectType";

export type ICredsConfig = {
  password: string;
  expiration: number;
};

export type IProcessContractAppTypeArgs = {
  detectedPackageManager: PackageManagerType;
  thirdwebDepsToUpdate: Set<string>;
  thirdwebDepsToInstall: Set<string>;
  isJSPackageManager: boolean;
};

export type IProcessAppTypeArgs = {
  detectedLibrary: LibraryType;
  detectedFramework: FrameworkType;
  thirdwebDepsToUpdate: Set<string>;
  thirdwebDepsToInstall: Set<string>;
  isJSPackageManager: boolean;
  isPythonPackageManager: boolean;
  isGoPackageManager: boolean;
  hasEthers: boolean;
  otherDeps: Set<string>;
};
