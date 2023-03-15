import { GENERATE_MESSAGES } from "../../constants/constants";
import {
  DeployedContract,
  fetchContractMetadataFromAddress,
  getChainProvider,
  ThirdwebSDK,
} from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import fs from "fs";
import prompts from "prompts";

type GenerateOptions = {
  path: string;
  deployer?: string;
};

export async function generate(options: GenerateOptions) {
  let projectPath: string = options.path?.replace(/\/$/, "") || ".";

  let contracts: DeployedContract[] = [];
  if (fs.existsSync(`${projectPath}/thirdweb.json`)) {
    // First we check if there's a thirdweb.json config file present
    const thirdwebConfig = JSON.parse(
      fs.readFileSync(`${projectPath}/thirdweb.json`, "utf-8"),
    );
    contracts = thirdwebConfig.contracts as DeployedContract[];
  } else {
    // Otherwise, we get contracts by deployer address (and generate a thirdweb.json)
    let deployerAddress: string;
    if (options.deployer) {
      deployerAddress = options.deployer;
    } else {
      const res = await prompts({
        type: "text",
        name: "deployer",
        message: GENERATE_MESSAGES.deployerAddress,
      });

      deployerAddress = res.deployer.trim();
    }

    const sdk = new ThirdwebSDK("polygon");
    contracts = await sdk.multiChainRegistry.getContractAddresses(
      deployerAddress,
    );

    fs.writeFileSync(
      `${projectPath}/thirdweb.json`,
      JSON.stringify({ contracts }, undefined, 2),
    );
  }

  // Attempt to download the ABI for the contract
  const storage = new ThirdwebStorage();
  const metadata = await Promise.all(
    contracts.map(async (contract) => {
      const provider = getChainProvider(contract.chainId, {}); // Handles caching providers by chain for us
      return {
        address: contract.address,
        metadata: await fetchContractMetadataFromAddress(
          contract.address,
          provider,
          storage,
        ),
      };
    }),
  );

  // Store the ABIs in the the SDKs ABI cache files
  const packagePath = `${projectPath}/node_modules/@thirdweb-dev/generated-abis/dist`;
  const filePaths = [
    `${packagePath}/thirdweb-dev-generated-abis.cjs.dev.js`,
    `${packagePath}/thirdweb-dev-generated-abis.cjs.prod.js`,
  ];

  filePaths.forEach((filePath) => {
    const file = fs.readFileSync(filePath, "utf-8");
    const abiRegex = /GENERATED_ABI = \{.*\}/s;
    const contractAbis = metadata.reduce((acc, contract) => {
      acc[contract.address] = contract.metadata.abi;
      return acc;
    }, {} as Record<string, any>);
    const updatedAbis = JSON.stringify(contractAbis, null, 2);
    const updatedFile = file.replace(
      abiRegex,
      `GENERATED_ABI = ${updatedAbis}`,
    );
    fs.writeFileSync(filePath, updatedFile);
  });

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
    ? packageJson.scripts.postinstall + ` && npx thirdweb generate`
    : `npx thirdweb generate`;

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
}
