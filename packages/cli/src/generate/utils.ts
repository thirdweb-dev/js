import { DeployedContract, getChainProvider } from "@thirdweb-dev/sdk";
import prompts from "prompts";
import { ContractChainPrompt } from "./types";
import { allChains } from "@thirdweb-dev/chains";

export const CHAIN_OPTIONS = allChains.map((chain) => ({ title: chain.slug }));

export async function getContractsForAddresses(
  addresses: string[],
  chainIds: number[],
  contracts: DeployedContract[],
) {
  const contractChainPrompts: ContractChainPrompt[] = [];

  await Promise.all(
    addresses.map(async (address) => {
      // Check which chainIds of the provided chains have a contract at this address
      const chainIdsWithContract: number[] = [];

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
      if (chainIdsWithContract.length === 1) {
        contracts.push({
          address,
          chainId: chainIdsWithContract[0],
        });
        return;
      }

      // Otherwise, add our contract to the list of contracts
      // where we need to prompt the user to select the chain
      contractChainPrompts.push({
        address,
        chains: chainIdsWithContract.map((chainId) => ({
          slug: allChains[chainId].slug,
          chainId,
        })),
      });
    }),
  );

  // TODO: Long term, smart contracts in the generated-abis cache should be cached by
  // both smart contract and chain id because people may want to use the same contract address
  // on different chains

  // For all addresses that have smart contracts deployed on multiple selected chains
  // allow the user to specify which chain they want to use for their smart contract
  for (const prompt of contractChainPrompts) {
    const res = await prompts({
      type: "select",
      name: "chainId",
      message: `What chain is smart contract '${prompt.address}' on?`,
      choices: prompt.chains.map((chain) => ({
        title: chain.slug,
        value: chain.chainId,
      })),
    });

    contracts.push({
      address: prompt.address,
      chainId: res.chainId,
    });
  }
}
