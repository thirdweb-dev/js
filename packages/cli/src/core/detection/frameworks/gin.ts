import { FrameworkDetector } from "../detector";
import { existsSync, readFileSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";
import { fileContainsImport, parseGoMod } from "../../../lib/utils";

export default class GinDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "gin";

  public matches(path: string): boolean {
    const goModFilePath = path + "/go.mod";
    const mainGoFilePath = path + "/main.go";
    let dependenciesExist = false;

    if (!existsSync(goModFilePath) && !existsSync(mainGoFilePath)) {
      return false;
    }

    if (existsSync(goModFilePath)) {
      const goModFile = readFileSync(goModFilePath, "utf-8");
      const { dependencies } = parseGoMod(goModFile);
      const dependenciesToCheck = ["github.com/gin-gonic/gin"];

      dependenciesExist = dependenciesToCheck.some((dependency) =>
        dependencies.some((importstr) => importstr.name === dependency),
      );
    }

    const mainGoFile = readFileSync(mainGoFilePath, "utf-8");
    const fileImportExists = fileContainsImport(
      mainGoFile,
      "github.com/gin-gonic/gin",
    );

    return dependenciesExist || fileImportExists || false;
  }
}
