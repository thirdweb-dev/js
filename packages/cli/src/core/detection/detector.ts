import {
  ProjectType,
  LanguageType,
  PackageManagerType,
  FrameworkType,
  LibraryType,
} from "../types/ProjectType";

export interface Detector {
  projectType: ProjectType;

  matches(path: string): boolean;
}

export interface PackageManagerDetector {
  packageManagerType: PackageManagerType;

  matches(path: string): boolean;
}

export interface FrameworkDetector {
  frameworkType: FrameworkType;

  matches(path: string, PackageManager?: PackageManagerType): boolean;
}

export interface LibraryDetector {
  libraryType: LibraryType;

  matches(path: string, PackageManager?: PackageManagerType): boolean;
}

export interface LanguageDetector {
  languageType: LanguageType;

  matches(path: string): boolean;
}
