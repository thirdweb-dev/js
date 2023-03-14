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
  address?: string;
  chain?: ChainSlug;
};

export async function generate(options: GenerateOptions) {
  // If a contract address wasn't passed, ask the user to enter one
  if (!options.address) {
    const res = await prompts({
      type: "text",
      name: "address",
      message: GENERATE_MESSAGES.contractAddress,
    });

    options.address = res.address.trim();
  }

  // If a chain wasn't passed, ask the user to enter one
  if (!options.chain) {
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

    options.chain = res.chain.trim();
  }

  // Attempt to download the ABI for the contract
  const storage = new ThirdwebStorage();
  const provider = getChainProvider(options.chain as ChainSlug, {});
  const metadata = await fetchContractMetadataFromAddress(
    options.address as string,
    provider,
    storage,
  );

  // Infer the contract type from the ABI

  // Store the ABI in the SDKs contract-abis.ts file
  fs.writeFileSync("contract-abi.json", JSON.stringify(metadata.abi, null, 2));

  // Add generate command to CI
}
