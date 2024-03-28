import { LibraryDetector } from "../detector";
import { LibraryType, PackageManagerType } from "../../types/ProjectType";
import { getDependenciesForPython } from "../../../lib/utils";

export default class Web3PyDetector implements LibraryDetector {
  public libraryType: LibraryType = "web3py";

  public matches(path: string, packageManager: PackageManagerType): boolean {
    const { dependencies, devDependencies } = getDependenciesForPython(
      path,
      packageManager,
    );

    return (
      !!dependencies.find((dep) => dep.includes("web3")) ||
      !!devDependencies.find((dep) => dep.includes("web3")) ||
      false
    );
  }
}
