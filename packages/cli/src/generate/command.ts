import { GENERATE_MESSAGES } from "../../constants/constants";
import {
  DeployedContract,
  fetchContractMetadataFromAddress,
  getChainProvider,
} from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { spinner, info } from "../core/helpers/logger";
import { allChains } from "@thirdweb-dev/chains";
import fs from "fs";
import prompts from "prompts";
import { findMatches } from "../common/file-helper";
import ora from "ora";
import { GenerateOptions, ThirdwebConfig } from "./types";
import { CHAIN_OPTIONS, getContractsForAddresses } from "./utils";

export async function generate(options: GenerateOptions) {
  let projectPath: string = options.path?.replace(/\/$/, "") || ".";
  let contracts: DeployedContract[] = [];

  // Find all addresses in this project
  let addresses: string[] = [];
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
    const newAddresses = addresses.filter(
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
          JSON.stringify({ contracts, chainIds }, undefined, 2),
        );

        const numberOfNewContracts =
          contracts.length - thirdwebConfig.contracts.length;
        info(
          `Updated thirdweb.json configuration with ${numberOfNewContracts} new smart contract${
            numberOfNewContracts === 1 ? "" : "s"
          } detected in your project.`,
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
      JSON.stringify({ contracts, chainIds }, undefined, 2),
    );

    info(
      `Created a thirdweb.json file with configuration for ${
        contracts.length
      } smart contract${
        contracts.length === 1 ? "" : "s"
      } detected in your project.\n\n    - Smart contracts configured in this file will have their ABIs predownloaded at build time, significantly improving SDK performance at runtime.\n\n    - You can also update this configuration manually, or run thirdweb generate again after making changes to your project.\n`,
    );
  }

  // Attempt to download the ABI for each contract
  const abiSpinner = spinner(
    `Downloading ABIs for smart contracts configured in 'thirdweb.json'`,
  );
  const storage = new ThirdwebStorage();
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
    throw new Error(
      `Unable to cache ABIs. Please ensure that you're using the latest @thirdweb-dev/sdk package`,
    );
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
    const contractAbis = metadata.reduce((acc, contract) => {
      acc[contract.address] = contract.metadata.abi;
      return acc;
    }, {} as Record<string, any>);
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
    const contractAbis = metadata.reduce((acc, contract) => {
      acc[contract.address] = contract.metadata.abi;
      return acc;
    }, {} as Record<string, any>);
    const updatedAbis = JSON.stringify(contractAbis, null, 2);
    const updatedFile = file.replace(abiRegex, `GENERATED_ABI: ${updatedAbis}`);
    fs.writeFileSync(typeFilePath, updatedFile);
  }

  abiSpinner.succeed(
    `Downloaded and cached ABIs for ${contracts.length} smart contract${
      contracts.length === 1 ? "" : "s"
    }`,
  );

  // Add generate command to postinstall
  const packageJsonPath = `${projectPath}/package.json`;
  if (!fs.existsSync(packageJsonPath)) {
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  if (packageJson.scripts?.postinstall?.includes("thirdweb generate")) {
    return;
  }

  const postinstall = packageJson.scripts?.postinstall
    ? packageJson.scripts.postinstall +
      ` && export THIRDWEB_CLI_SKIP_INTRO=true && npx thirdweb generate --skip-update-check`
    : `export THIRDWEB_CLI_SKIP_INTRO=true && npx thirdweb generate --skip-update-check`;

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
    "The 'npx thirdweb generate' command has been added to the postinstall command of your package.json file.\n\n    This step is necessary to gain the performance boost that 'thirdweb generate' provides in your production environment.\n",
  ).info();
}
