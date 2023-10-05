import { LibraryDetector } from "../detector";
import { existsSync } from "fs";
import { LibraryType } from "../../types/ProjectType";

export default class PlayMakerDetector implements LibraryDetector {
  public libraryType: LibraryType = "playmaker";

  public matches(path: string): boolean {
    const foundPlayMaker = existsSync(path + "/Assets/PlayMaker");
    const foundPlayMakerDLL = existsSync(path + "/Editor/PlayMaker.dll");

    return foundPlayMaker || foundPlayMakerDLL || false;
  }
}
