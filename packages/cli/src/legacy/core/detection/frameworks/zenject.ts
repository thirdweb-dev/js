import { FrameworkDetector } from "../detector";
import { existsSync } from "fs";
import { FrameworkType } from "../../types/ProjectType";

export default class ZenjectDetector implements FrameworkDetector {
  public frameworkType: FrameworkType = "zenject";

  public matches(path: string): boolean {
    const foundZenject = existsSync(path + "/Assets/Zenject");
    const foundZenjectDLL = existsSync(
      path + "/Assets/Zenject/OptionalExtras/Zenject.dll",
    );
    const foundScript = existsSync(path + "/Assets/Scripts/ProjectContext.cs");

    return foundZenject || foundZenjectDLL || foundScript || false;
  }
}
