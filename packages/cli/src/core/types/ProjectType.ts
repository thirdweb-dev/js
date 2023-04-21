export type ProjectType =
  | "brownie"
  | "foundry"
  | "hardhat"
  | "truffle"
  | "solc"
  | "vite"
  | "next"
  | "cra"
  | "spa-webapp"
  | "yarn"
  | "npm"
  | "none"
  | "pnpm";

export type PackageManagerType = "yarn" | "npm" | "pnpm" | "pip" | "conda" | "pipenv" | "poetry" | "go-modules" | "none";
export type LanguageType = "javascript" | "typescript" | "python" | "go" | "c#" | "solidity" | "none";
export type FrameworkType = "next" | "gatsby" | "remix" | "cra" | "vite" | "vue" | "expo" | "react-native-cli" | "node" | "express" | "hardhat" | "truffle" | "foundry" | "brownie" | "solc" | "none";
export type LibraryType = "react" | "react-native" | "vue" | "angular" | "svelte" | "none";
export type AppType = "app" | "contract" | "library" | "none";