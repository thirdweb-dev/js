import { GENERATE_MESSAGES } from "../../constants/constants";
import type { ChainSlug } from "@thirdweb-dev/chains";
import {
  fetchContractMetadataFromAddress,
  getChainProvider,
} from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import fs from "fs";
import prompts from "prompts";

type GenerateOptions = {
  path?: string;
  address?: string;
  chain?: ChainSlug;
};

export async function generate(options: GenerateOptions) {
  let address: string;
  let chain: string;

  // If a contract address wasn't passed, ask the user to enter one
  if (options.address) {
    address = options.address;
  } else {
    const res = await prompts({
      type: "text",
      name: "address",
      message: GENERATE_MESSAGES.contractAddress,
    });

    address = res.address.trim();
  }

  // If a chain wasn't passed, ask the user to enter one
  if (options.chain) {
    chain = options.chain;
  } else {
    const res = await prompts({
      type: "text",
      name: "chain",
      message: GENERATE_MESSAGES.chain,
      format: (chain: string) => chain.toLowerCase(),
      validate: (chain: string) => {
        // TODO: Validate chain with SDK
        console.log(chain);
        return true;
      },
    });

    chain = res.chain.trim();
  }

  // Attempt to download the ABI for the contract
  const storage = new ThirdwebStorage();
  const provider = getChainProvider(chain, {});
  const metadata = await fetchContractMetadataFromAddress(
    address,
    provider,
    storage,
  );

  // Infer the contract type from the ABI

  // Store the ABI in the SDKs contract-abis.ts file
  const packagePath = options.path
    ? `${options.path.replace(
        /\/$/,
        "",
      )}/node_modules/@thirdweb-dev/generated-abis`
    : "node_modules/@thirdweb-dev/generated-abis";

  const filePath = `${packagePath}/thirdweb-dev-generated-abis.cjs.dev.js`;
  const file = fs.readFileSync(filePath, "utf-8");
  const abiRegex = `GENERATED_ABI = \{.*\}`;
  const matches = file.match(abiRegex);
  if (!matches) throw new Error("ABI file not found!");
  const abis = JSON.parse(matches[0].replace(`GENERATED_ABI = `, ``));
  abis[address] = metadata.abi;
  const updatedAbis = JSON.stringify(abis, null, 2);
  const updatedFile = file.replace(abiRegex, updatedAbis);
  console.log(updatedFile);

  fs.writeFileSync(filePath, updatedFile);

  // Add generate command to CI
}
