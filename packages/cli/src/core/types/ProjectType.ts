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
export type FrameworkType = "next" | "gatsby" | "remix" | "cra" | "vue" | "expo" | "react-native-cli" | "express" | "hardhat" | "truffle" | "foundry" | "brownie" | "solc" | "django" | "flask" | "fastapi" | "populus" | "fastify" | "none";
export type LibraryType = "react" | "react-native" | "vue" | "svelte" | "vite" | "express" | "web3py" | "none";
export type AppType = "app" | "contract" | "library" | "none";