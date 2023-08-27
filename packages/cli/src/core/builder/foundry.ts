import { findFiles } from "../../common/file-helper";
import { hasForge } from "../../create/helpers/has-forge";
import { execute } from "../helpers/exec";
import { logger } from "../helpers/logger";
import { CompileOptions } from "../interfaces/Builder";
import { ContractPayload } from "../interfaces/ContractPayload";
import { BaseBuilder } from "./builder-base";
import chalk from "chalk";
import { existsSync, readFileSync } from "fs";
import { basename, join } from "path";

export class FoundryBuilder extends BaseBuilder {
  public async compile(options: CompileOptions): Promise<{
    contracts: ContractPayload[];
  }> {
    const isInstalled = await hasForge();
    if (!isInstalled) {
      console.error(
        `\n${chalk.redBright(
          `error`,
        )} You don't have forge installed on this machine!\n\nYou can install forge by following these instructions:\n${chalk.blueBright(
          `https://book.getfoundry.sh/getting-started/installation`,
        )}\n`,
      );
      process.exit(1);
    }

    if (options.clean) {
      await execute("forge clean", options.projectPath);
    }
    await execute("forge build --extra-output metadata", options.projectPath);

    // get the current config first
    const foundryConfig = (
      await execute("forge config --json", options.projectPath)
    ).stdout;

    const actualFoundryConfig = JSON.parse(foundryConfig);

    const outPath = join(options.projectPath, actualFoundryConfig.out);

    const contracts: ContractPayload[] = [];
    const files: string[] = [];
    findFiles(outPath, /^.*(?<!metadata)\.json$/, files);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const contractName = basename(file, ".json");
      const contractJsonFile = readFileSync(file, "utf-8");

      const contractInfo = JSON.parse(contractJsonFile);

      if (
        !contractInfo.bytecode ||
        !contractInfo.deployedBytecode ||
        !contractInfo.metadata
      ) {
        logger.debug("Skipping", contractName, "(no bytecode or metadata)");
        continue;
      }

      const target = contractInfo.metadata.settings.compilationTarget;
      if (
        Object.keys(target).length === 0 ||
        Object.keys(target)[0].includes("@") ||
        this.isTestOrScript(Object.keys(target)[0])
      ) {
        // skip library contracts
        logger.debug("Skipping", contractName, "(not a source target)");
        continue;
      }

      if (contractName.startsWith("std")) {
        // skip library contracts
        logger.debug("Skipping", contractName, "(std library contract)");
        continue;
      }

      const bytecode = contractInfo.bytecode.object;
      const deployedBytecode = contractInfo.deployedBytecode.object;
      const parsedMetadata = contractInfo.metadata;
      const metadata =
        contractInfo.rawMetadata ||
        this.sanitizeParsedMetadata(parsedMetadata, contractInfo.abi);

      const sources = Object.keys(parsedMetadata.sources)
        .map((path) => {
          if (path.startsWith("/") && existsSync(path)) {
            return path;
          }
          const sourcePath = join(options.projectPath, path);
          if (existsSync(sourcePath)) {
            return sourcePath;
          }
          const nodeModulesPath = join(
            options.projectPath,
            "node_modules",
            path,
          );
          if (existsSync(nodeModulesPath)) {
            return nodeModulesPath;
          }
          return undefined;
        })
        .filter((path) => path !== undefined) as string[];

      const fileNames = Object.keys(
        parsedMetadata?.settings?.compilationTarget || {},
      );
      const fileName = fileNames.length > 0 ? fileNames[0] : "";

      if (
        this.shouldProcessContract(
          contractInfo.abi,
          deployedBytecode,
          contractName,
        )
      ) {
        contracts.push({
          name: contractName,
          metadata,
          bytecode,
          fileName,
          sources,
        });
      }
    }
    return { contracts };
  }

  private isTestOrScript(target: string) {
    return target.endsWith(".s.sol") || target.endsWith(".t.sol");
  }

  private sort(object: any) {
    if (typeof object !== "object" || object instanceof Array) {
      // Not to sort the array
      return object;
    }
    const keys = Object.keys(object);
    keys.sort();
    const newObject: any = {};
    for (let i = 0; i < keys.length; i++) {
      newObject[keys[i]] = this.sort(object[keys[i]]);
    }
    return newObject;
  }

  private sanitizeParsedMetadata(
    parsedMetadata: Record<string, any>,
    abi: any,
  ) {
    // replace the abi with the actual abi
    parsedMetadata.output.abi = abi;
    // need to re-add libraries if not present since forge strips it out
    if (!parsedMetadata.settings.libraries) {
      parsedMetadata.settings.libraries = {};
    }
    // evm version can be omitted, add a default if not present
    if (!parsedMetadata.settings.evmVersion) {
      parsedMetadata.settings.evmVersion = "london";
    }
    // delete `outputSelection` from the metadata which has nothing to do here, bug in forge
    delete parsedMetadata.settings.outputSelection;
    // sort the metadata ALPHABETICALLY, since forge shuffles the keys in their parsing
    const meta: any = this.sort(parsedMetadata);
    return JSON.stringify(meta);
  }
}
