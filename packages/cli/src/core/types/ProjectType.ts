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

export type PackageManagerType =
  | "yarn"
  | "npm"
  | "pnpm"
  | "pip"
  | "conda"
  | "pipenv"
  | "poetry"
  | "go-modules"
  | "none";
export type LanguageType =
  | "javascript"
  | "typescript"
  | "python"
  | "go"
  | "c#"
  | "solidity"
  | "none";
export type FrameworkType =
  | "next"
  | "gatsby"
  | "remix"
  | "cra"
  | "vue"
  | "expo"
  | "react-native-cli"
  | "express"
  | "hardhat"
  | "truffle"
  | "foundry"
  | "brownie"
  | "solc"
  | "django"
  | "flask"
  | "fastapi"
  | "populus"
  | "fastify"
  | "gin"
  | "echo"
  | "revel"
  | "fiber"
  | "zenject"
  | "none";
export type LibraryType =
  | "react"
  | "react-native"
  | "vue"
  | "svelte"
  | "vite"
  | "express"
  | "web3py"
  | "playmaker"
  | "none";
export type AppType = "app" | "contract" | "library" | "none";
export type ContractLibrariesType =
  | "brownie"
  | "foundry"
  | "hardhat"
  | "truffle"
  | "solc"
  | "none";


export const contractLibraries: readonly ContractLibrariesType[] = [
  "brownie",
  "foundry",
  "hardhat",
  "truffle",
  "solc",
  "none",
] as const;
