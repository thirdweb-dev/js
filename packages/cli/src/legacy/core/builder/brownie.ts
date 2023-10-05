import { findFiles } from "../../common/file-helper";
import { execute } from "../helpers/exec";
import { logger } from "../helpers/logger";
import { CompileOptions } from "../interfaces/Builder";
import { ContractPayload } from "../interfaces/ContractPayload";
import { BaseBuilder } from "./builder-base";
import { existsSync, readFileSync, rmSync } from "fs";
import { basename, join } from "path";
import { parse } from "yaml";

export class BrownieBuilder extends BaseBuilder {
  public async compile(options: CompileOptions): Promise<{
    contracts: ContractPayload[];
  }> {
    const config = parse(
      readFileSync(join(options.projectPath, "brownie-config.yaml"), "utf-8"),
    );

    const buildPath = join(
      options.projectPath,
      config?.project_structure?.build || "./build",
    );

    if (existsSync(buildPath)) {
      rmSync(buildPath, { recursive: true });
    }

    await execute("brownie compile", options.projectPath);

    const contractsPath = join(buildPath, "contracts/");

    const contracts: ContractPayload[] = [];
    const files: string[] = [];
    findFiles(contractsPath, /^.*(?<!dbg)\.json$/, files);

    // TODO find a way to extract compiler metadata from brownie artifacts
    for (const file of files) {
      logger.debug("Processing:", file.replace(contractsPath, ""));
      const contractName = basename(file, ".json");
      const contractJsonFile = readFileSync(file, "utf-8");

      const contractInfo = JSON.parse(contractJsonFile);
      const { abi, bytecode } = contractInfo;

      for (const input of abi) {
        if (this.isThirdwebContract(input)) {
          if (contracts.find((c) => c.name === contractName)) {
            logger.error(
              `Found multiple contracts with name "${contractName}". Contract names should be unique.`,
            );
            process.exit(1);
          }
          contracts.push({
            metadata: {},
            bytecode,
            sources: [], // TODO
            fileName: "", // TODO
            name: contractName,
          });
          break;
        }
      }
    }

    return { contracts };
  }
}
