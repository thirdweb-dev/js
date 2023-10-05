import { allChains } from "@thirdweb-dev/chains";
import {
  DeployedContract,
  fetchContractMetadataFromAddress,
  getChainProvider,
} from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import fs from "fs";
import ora from "ora";
import prompts from "prompts";
import { findMatches } from "../common/file-helper";
import { info } from "../core/helpers/logger";
import { GenerateOptions, ThirdwebConfig } from "./types";
import { CHAIN_OPTIONS, getContractsForAddresses } from "./utils";
import { GENERATE_MESSAGES } from "../../../constants/constants";

export async function generate(options: GenerateOptions, secretKey: string) {
  const projectPath: string = options.path?.replace(/\/$/, "") || ".";
  let contracts: DeployedContract[] = [];

  // Find all addresses in this project
  const addresses: string[] = [];
  findMatches(projectPath, /(0x[a-fA-F0-9]{40})/g, addresses);

  // We check if there's a thirdweb.json config file present
  if (fs.existsSync(`${projectPath}/thirdweb.json`)) {
    // Read the current thirdweb config file
    const thirdwebConfig: ThirdwebConfig = JSON.parse(
      fs.readFileSync(`${projectPath}/thirdweb.json`, "utf-8"),
    );

    // Check if there are any addresses in the project that aren't yet in the config
    const configAddresses = thirdwebConfig.contracts.map((contract) =>
      contract.address.toLowerCase(),
    );
    const newAddresses = Array.from(new Set(addresses)).filter(
      (address) => !configAddresses.includes(address.toLowerCase()),
    );

    // Initialize contracts to the contracts in thirdweb.json file
    contracts = [...thirdwebConfig.contracts];

    // If we have new contracts that aren't yet stored in config
    // get full contract objects
    if (newAddresses.length) {
      const chainIds = thirdwebConfig.chainIds;
      await getContractsForAddresses(newAddresses, chainIds, contracts);

      if (contracts.length > thirdwebConfig.contracts.length) {
        fs.writeFileSync(
          `${projectPath}/thirdweb.json`,
          JSON.stringify({ chainIds, contracts }, undefined, 2),
        );

        const numberOfNewContracts =
          contracts.length - thirdwebConfig.contracts.length;
        info(
          `Updated thirdweb.json with ${numberOfNewContracts} new contract${
            numberOfNewContracts === 1 ? "" : "s"
          }`,
        );
      }
    }
  } else {
    // If there is no configuration file present, we need to generate one...

    // First we ask the user what chains are used in their project
    const res = await prompts({
      type: "autocompleteMultiselect",
      name: "chains",
      message: GENERATE_MESSAGES.chains,
      choices: CHAIN_OPTIONS,
    });

    const chainIds: number[] = res.chains.map(
      (index: number) => allChains[index].chainId,
    );

    // Then we check for the chainId of each address
    await getContractsForAddresses(addresses, chainIds, contracts);

    // Create a thirdweb.json file with the specific contracts and chain ids
    fs.writeFileSync(
      `${projectPath}/thirdweb.json`,
      JSON.stringify({ chainIds, contracts }, undefined, 2),
    );

    info(
      `Created a thirdweb.json file with configuration for ${
        contracts.length
      } contract${
        contracts.length === 1 ? "" : "s"
      } detected in your project.\n\n - You can also update this configuration manually by editing the file.\n`,
    );
  }

  // Attempt to download the ABI for each contract
  ora(`Downloading ABIs for contracts configured in 'thirdweb.json'`).info();
  let storage: ThirdwebStorage;
  if (secretKey) {
    storage = new ThirdwebStorage({
      secretKey,
    });
  } else {
    storage = new ThirdwebStorage();
  }
  const metadata: {
    address: string;
    metadata: Awaited<ReturnType<typeof fetchContractMetadataFromAddress>>;
  }[] = [];
  await Promise.all(
    contracts.map(async (contract) => {
      const provider = getChainProvider(contract.chainId, {}); // Handles caching providers by chain for us
      let contractMetadata;
      try {
        contractMetadata = await fetchContractMetadataFromAddress(
          contract.address,
          provider,
          storage,
        );
      } catch {
        // If metadata for a contract fails, just go onto the next one
        ora(
          `Unable to download ABI for contract ${contract.address}, skipping.`,
        ).warn();
        return;
      }

      metadata.push({
        address: contract.address,
        metadata: contractMetadata,
      });
    }),
  );

  // Store the ABIs in the the SDKs ABI cache files
  const packagePath = `${projectPath}/node_modules/@thirdweb-dev/generated-abis/dist`;
  if (!fs.existsSync(packagePath)) {
    ora(
      `Unable to cache ABIs. Please ensure that you have the latest @thirdweb-dev/sdk package installed.`,
    ).fail();
    process.exit(1);
  }

  const filePaths = [
    `${packagePath}/thirdweb-dev-generated-abis.cjs.js`,
    `${packagePath}/thirdweb-dev-generated-abis.esm.js`,
  ];

  filePaths.forEach((filePath) => {
    if (!fs.existsSync(filePath)) {
      return;
    }

    const file = fs.readFileSync(filePath, "utf-8");
    const abiRegex = /GENERATED_ABI = \{.*\};\n\n/s;
    const contractAbis = metadata.reduce(
      (acc, contract) => {
        acc[contract.address] = contract.metadata.abi;
        return acc;
      },
      {} as Record<string, any>,
    );
    const updatedAbis = JSON.stringify(contractAbis, null, 2);
    const updatedFile = file.replace(
      abiRegex,
      `GENERATED_ABI = ${updatedAbis};\n\n`,
    );

    fs.writeFileSync(filePath, updatedFile);
  });

  // Update cache for ABI types
  {
    const typeFilePath = `${packagePath}/declarations/src/index.d.ts`;
    if (!fs.existsSync(typeFilePath)) {
      return;
    }

    const file = fs.readFileSync(typeFilePath, "utf-8");
    const abiRegex = /GENERATED_ABI: \{.*\}/s;
    const contractAbis = metadata.reduce(
      (acc, contract) => {
        acc[contract.address] = contract.metadata.abi;
        return acc;
      },
      {} as Record<string, any>,
    );
    const updatedAbis = JSON.stringify(contractAbis, null, 2);
    const updatedFile = file.replace(abiRegex, `GENERATED_ABI: ${updatedAbis}`);
    fs.writeFileSync(typeFilePath, updatedFile);
  }

  ora(
    `Downloaded and cached ABIs for ${metadata.length} smart contract${
      metadata.length === 1 ? "" : "s"
    }`,
  ).succeed();

  // Add generate command to postinstall
  const packageJsonPath = `${projectPath}/package.json`;
  if (!fs.existsSync(packageJsonPath)) {
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  if (
    packageJson.scripts?.postinstall?.includes("thirdweb generate") ||
    packageJson.scripts?.postinstall?.includes("thirdweb@latest generate")
  ) {
    return;
  }

  const postinstall = packageJson.scripts?.postinstall
    ? packageJson.scripts.postinstall + `npx --yes thirdweb@latest generate`
    : `npx --yes thirdweb@latest generate`;

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(
      {
        ...packageJson,
        scripts: {
          ...packageJson.scripts,
          postinstall,
        },
      },
      undefined,
      2,
    ),
  );

  ora(
    "Added 'npx thirdweb generate' to postinstall in package.json.\n\n - This is necessary to use 'thirdweb generate' in production.\n",
  ).info();
}
