import { findFiles } from "../../common/file-helper";
import { execute } from "../helpers/exec";
import { logger } from "../helpers/logger";
import { ContractPayload } from "../interfaces/ContractPayload";
import { BaseBuilder } from "./builder-base";
import { existsSync, readFileSync } from "fs";
import { HardhatConfig } from "hardhat/types";
import { join, resolve } from "path";

export class HardhatBuilder extends BaseBuilder {
  public async compile(options: any): Promise<{
    contracts: ContractPayload[];
  }> {
    //we get our very own extractor script from the dir that we're in during execution
    // this is `./dist/cli` (for all purposes of the CLI)
    // then we look up the hardhat config extractor file path from there
    const configExtractorScriptPath = resolve(
      __dirname,
      "../legacy/helpers/hardhat-config-extractor.js",
    );

    //the hardhat extractor **logs out** the runtime config of hardhat, we take that stdout and parse it
    const stringifiedConfig = (
      await execute(
        `npx hardhat run "${configExtractorScriptPath}" --no-compile`,
        options.projectPath,
      )
    ).stdout;
    //voila the hardhat config

    const actualHardhatConfig = JSON.parse(
      stringifiedConfig.split("__tw__")[1],
    ) as HardhatConfig;

    logger.debug("successfully extracted hardhat config", actualHardhatConfig);

    await execute("npx hardhat clean", options.projectPath);

    let ignoreIpfsHash = false;
    if (options.zksync) {
      const zkNetwork = Object.entries(actualHardhatConfig.networks).find(
        (network) => {
          return (network[1] as any).zksync;
        },
      );
      ignoreIpfsHash = (zkNetwork?.[1] as any).zksync; // IPFS hash can't be recovered from ZKSync bytecode
      await execute(
        `npx hardhat compile --network ${zkNetwork?.[0]}`,
        options.projectPath,
      );
    } else {
      await execute(`npx hardhat compile`, options.projectPath);
    }

    const solcConfigs = actualHardhatConfig.solidity.compilers;
    if (solcConfigs) {
      for (const solcConfig of solcConfigs) {
        const byteCodeHash = solcConfig.settings?.metadata?.bytecodeHash;
        if (byteCodeHash && byteCodeHash !== "ipfs") {
          throw new Error(
            `Deploying requires "bytecodeHash: 'ipfs'" in your hardhat.config.js file, but it's currently set as "bytecodeHash: '${byteCodeHash}'". Please change it to 'ipfs' and try again.`,
          );
        }
      }
    }

    const artifactsPath = actualHardhatConfig.paths.artifacts;
    const sourcesDir = actualHardhatConfig.paths.sources.replace(
      options.projectPath,
      "",
    );
    const contractsPath = join(artifactsPath, sourcesDir);

    const contracts: ContractPayload[] = [];
    const files: string[] = [];
    findFiles(contractsPath, /^.*(?<!dbg)\.json$/, files);

    const buildOutputPath = join(artifactsPath, "build-info");
    const buildFiles: string[] = [];
    findFiles(buildOutputPath, /^.*(?<!dbg)\.json$/, buildFiles);

    for (const buildFile of buildFiles) {
      const buildJsonFile = readFileSync(buildFile, "utf-8");
      const buildJson = JSON.parse(buildJsonFile);

      const contractBuildOutputs = buildJson.output.contracts;

      for (const [contractPath, contractInfos] of Object.entries(
        contractBuildOutputs,
      )) {
        if (contractPath.includes("@")) {
          // skip library contracts
          logger.debug("Skipping", contractPath, "(not a source target)");
          continue;
        }
        for (const [contractName, contractInfo] of Object.entries(
          contractInfos as any,
        )) {
          const info = contractInfo as any;

          if (
            !info.evm ||
            !info.evm.bytecode ||
            !info.evm.bytecode.object ||
            !info.metadata ||
            !info.abi
          ) {
            logger.debug("Skipping", contractPath, "(no bytecode or metadata)");
            continue;
          }

          const bytecode = info.evm.bytecode.object;
          const deployedBytecode =
            info.evm.deployedBytecode?.object || bytecode;
          const { metadata, abi } = info;

          const meta = metadata.solc_metadata
            ? JSON.parse(metadata.solc_metadata)
            : JSON.parse(metadata);
          const sources = Object.keys(meta.sources)
            .map((path) => {
              const directPath = join(options.projectPath, path);
              if (existsSync(directPath)) {
                return directPath;
              }
              const sourcePath = join(options.projectPath, sourcesDir, path);
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
            meta?.settings?.compilationTarget || {},
          );
          const fileName = fileNames.length > 0 ? fileNames[0] : "";

          if (
            this.shouldProcessContract(
              abi,
              deployedBytecode,
              contractName,
              ignoreIpfsHash,
            )
          ) {
            contracts.push({
              metadata: JSON.stringify(meta),
              bytecode,
              name: contractName,
              fileName,
              sources,
            });
          }
        }
      }
    }
    return {
      contracts,
    };
  }
}
