import { findFiles } from "../../common/file-helper";
import { execute } from "../helpers/exec";
import { logger } from "../helpers/logger";
import { CompileOptions } from "../interfaces/Builder";
import { ContractPayload } from "../interfaces/ContractPayload";
import { BaseBuilder } from "./builder-base";
import { existsSync, readFileSync, rmSync } from "fs";
import { join } from "path";

export class TruffleBuilder extends BaseBuilder {
  public async compile(options: CompileOptions): Promise<{
    contracts: ContractPayload[];
  }> {
    // get the current config first
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const truffleConfig = require(join(
      options.projectPath,
      "truffle-config.js",
    ));

    const buildPath = join(
      options.projectPath,
      truffleConfig.contracts_build_directory || "./build/contracts",
    );

    if (existsSync(buildPath)) {
      rmSync(buildPath, { recursive: true });
    }

    await execute("npx --yes truffle compile", options.projectPath);

    const contracts: ContractPayload[] = [];
    const files: string[] = [];
    findFiles(buildPath, /^.*(?<!dbg)\.json$/, files);

    for (const file of files) {
      logger.debug("Processing:", file.replace(buildPath, ""));
      const contractJsonFile = readFileSync(file, "utf-8");
      const contractInfo = JSON.parse(contractJsonFile);
      const { contractName, metadata, bytecode, deployedBytecode } =
        contractInfo;
      const meta = JSON.parse(metadata);
      const abi = meta.output.abi;

      const target = meta.settings.compilationTarget;
      if (
        Object.keys(target).length === 0 ||
        Object.keys(target)[0].includes("@")
      ) {
        // skip library contracts
        logger.debug("Skipping", contractName, "(not a source target)");
        continue;
      }

      const sources = Object.keys(meta.sources)
        .map((path) => {
          path = path.replace("project:/", "");
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

      const fileNames = Object.keys(meta?.settings?.compilationTarget || {});
      const fileName = fileNames.length > 0 ? fileNames[0] : "";

      if (this.shouldProcessContract(abi, deployedBytecode, contractName)) {
        contracts.push({
          metadata,
          bytecode,
          name: contractName,
          fileName,
          sources,
        });
      }
    }
    return { contracts };
  }
}
