import { findFiles } from "../../common/file-helper";
import { logger } from "../helpers/logger";
import { CompileOptions } from "../interfaces/Builder";
import { ContractPayload } from "../interfaces/ContractPayload";
import { BaseBuilder } from "./builder-base";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { basename, join } from "path";
import solc from "solc";

export class SolcBuilder extends BaseBuilder {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  public async compile(options: CompileOptions): Promise<{
    contracts: ContractPayload[];
  }> {
    // find solidity files...
    const inputPaths: string[] = [];
    findFiles(options.projectPath, /^.*\.sol$/, inputPaths);

    const sources = inputPaths.reduce(
      (acc, curr) => {
        const source = readFileSync(curr, "utf-8");
        acc[basename(curr)] = { content: source };
        return acc;
      },
      {} as Record<string, { content: string }>,
    );

    const input = {
      language: "Solidity",
      sources,
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
        optimizer: {
          enabled: true,
          runs: 800,
        },
      },
    };

    const output = JSON.parse(
      solc.compile(JSON.stringify(input), {
        import: (path: string) => {
          const nodeModulesPath = join(
            options.projectPath,
            "node_modules",
            path,
          );
          if (existsSync(nodeModulesPath)) {
            return { contents: readFileSync(nodeModulesPath, "utf-8") };
          }
          return {
            error: "file not found",
          };
        },
      }),
    );

    if (output.errors) {
      logger.error(output.errors);
      throw new Error("Error compiling Solidity files");
    }

    const artifactsDir = join(options.projectPath, "artifacts");
    if (existsSync(artifactsDir)) {
      rmSync(artifactsDir, { recursive: true });
    }

    if (!existsSync(artifactsDir)) {
      mkdirSync(artifactsDir);
    }

    // write them out to artifacts dir
    // TODO technically we *could* just return them straight here, we have them in memory anyway?
    Object.keys(output.contracts)
      .filter((contractName) => contractName in sources)
      .forEach((contractName) => {
        const contract = output.contracts[contractName];
        const contractPath = join(
          options.projectPath,
          "artifacts",
          contractName,
        );

        if (!existsSync(contractPath)) {
          mkdirSync(contractPath);
        }

        const contractNamesInNamespace = Object.keys(contract);
        for (const c of contractNamesInNamespace) {
          const contractFile = contract[c];
          const contractFilePath = join(contractPath, c + ".json");
          writeFileSync(
            contractFilePath,
            JSON.stringify(contractFile, null, 2),
          );
        }
      });

    const contracts: ContractPayload[] = [];
    const files: string[] = [];
    findFiles(artifactsDir, /^.*(?<!dbg)\.json$/, files);

    for (const file of files) {
      logger.debug("Processing:", file.replace(artifactsDir, ""));
      const contractName = basename(file, ".json");
      const contractJsonFile = readFileSync(file, "utf-8");

      const contractInfo = JSON.parse(contractJsonFile);
      const bytecode = contractInfo.evm.bytecode.object;
      const deployedBytecode = contractInfo.evm.deployedBytecode.object;
      const metadata = contractInfo.metadata;
      const parsedMetadata = JSON.parse(metadata);
      const abi = parsedMetadata.output.abi;

      const target = parsedMetadata.settings.compilationTarget;
      if (
        Object.keys(target).length === 0 ||
        Object.keys(target)[0].includes("@")
      ) {
        // skip library contracts
        logger.debug("Skipping", contractName, "(not a source target)");
        continue;
      }

      const _sources = Object.keys(parsedMetadata.sources)
        .map((path) => {
          const matchingSourcePath = inputPaths.find((p) => p.includes(path));
          if (matchingSourcePath && existsSync(matchingSourcePath)) {
            return matchingSourcePath;
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

      if (this.shouldProcessContract(abi, deployedBytecode, contractName)) {
        contracts.push({
          metadata,
          bytecode,
          name: contractName,
          fileName,
          sources: _sources,
        });
      }
    }
    return { contracts };
  }
}
