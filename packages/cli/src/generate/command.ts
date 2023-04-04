import { GENERATE_MESSAGES } from "../../constants/constants";
import {
  DeployedContract,
  fetchContractMetadataFromAddress,
  getChainProvider,
  ThirdwebSDK,
} from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { spinner, info } from "../core/helpers/logger";
import { allChains } from "@thirdweb-dev/chains";
import { find } from "find-in-files";
import fs from "fs";
import prompts from "prompts";
import { findMatches } from "../common/file-helper";

type GenerateOptions = {
  path: string;
  deployer?: string;
};

const CHAIN_OPTIONS = allChains.map((chain) => ({ title: chain.slug }));

export async function generate(options: GenerateOptions) {
  let projectPath: string = options.path?.replace(/\/$/, "") || ".";
  let contracts: DeployedContract[] = [];

  // Find all addresses in this project
  let addresses: string[] = [];
  findMatches(projectPath, /(0x[a-fA-F0-9]{40})/g, addresses);

  // We check if there's a thirdweb.json config file present
  if (fs.existsSync(`${projectPath}/thirdweb.json`)) {
    const thirdwebConfig = JSON.parse(
      fs.readFileSync(`${projectPath}/thirdweb.json`, "utf-8"),
    );

    contracts = thirdwebConfig.contracts as DeployedContract[];
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
    addresses.map(async (address) => {
      // Check which chainIds of the provided chains have a contract at this address
      let chainIdsWithContract: number[] = [];

      await Promise.all(
        chainIds.map(async (chainId) => {
          // Handles cacheing of provider by chain
          const provider = getChainProvider(chainId, {});

          try {
            const code = await provider.getCode(address);

            if (!code || code === "0x") {
              return;
            }

            chainIdsWithContract.push(chainId);
          } catch {
            return;
          }
        }),
      );

      // If no chainId has this contract, we assume it's an EOA and move on
      if (!chainIdsWithContract.length) {
        return;
      }

      // If only one chain has this contract address, add it to our contracts list
      if (chainIdsWithContract.length) {
      }
    });

    fs.writeFileSync(
      `${projectPath}/thirdweb.json`,
      JSON.stringify({ contracts, chainIds }, undefined, 2),
    );
  }

  /*
  // Attempt to download the ABI for each contract
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
  */
}
