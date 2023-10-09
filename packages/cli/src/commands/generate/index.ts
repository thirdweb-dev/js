import { Command } from "@commander-js/extra-typings";
import { ensureAuth, getSession } from "../../auth";
import prompts from "prompts";
import { getChains } from "./chains/chain-cache";
import { getAccount } from "../../auth/account";
import {
  enrichContractMetadata,
  getContractsForChains,
} from "./contracts/account-contracts";
import { logger } from "../../utils/logger";
import chalk from "chalk";
import { Chain } from "@thirdweb-dev/chains";
import ora from "ora";

export const generate = new Command("generate")
  .description(
    "🔧 preload chains & contracts into your project for strong type safety & improved performance",
  )
  .option("-p, --path <project-path>", "path to project", ".")
  .option("-k, --key <key>", "API secret key to authorize usage")
  .option(
    "--no-cache",
    "do not use cached values, instead force a network call",
    false,
  )
  .action(async (options) => {
    const secretKey = await ensureAuth(options.key);
    // get the account creator wallet address
    const token = (await getSession()) || "";
    const { creatorWalletAddress } = await getAccount({ token, secretKey });

    const chainSpinner = ora("Loading chains.").start();
    const possibleChains = await getChains({ noCache: options.cache }).catch(
      (err) => {
        chainSpinner.fail("Failed to load chains.");
        throw err;
      },
    );
    chainSpinner.succeed("Chains loaded.");

    const [chainResponse, allUserContracts] = await Promise.all([
      prompts({
        type: "autocompleteMultiselect",
        choices: possibleChains.map((chain) => ({
          title: `${chalk.bold(chain.name)} ${chalk.grey(
            `(${chain.chainId})`,
          )}`,
          value: chain,
        })),
        instructions: false,
        name: "chains",
        message: "Which chains do you want to use?",
      }),
      getContractsForChains(creatorWalletAddress, possibleChains, secretKey),
    ]);

    const selectedChains: Chain[] = chainResponse.chains;

    const chainsWithContracts = selectedChains.map((chain) => ({
      chain,
      contracts: allUserContracts.filter((c) => c.chainId === chain.chainId),
    }));

    const enrichedContractsPromiseByChainid = new Map<
      number,
      ReturnType<typeof enrichContractMetadata> | null
    >();
    for (const chain of chainsWithContracts) {
      enrichedContractsPromiseByChainid.set(
        chain.chain.chainId,
        chain.contracts ? enrichContractMetadata(chain.contracts) : null,
      );
    }

    for (const pickedChain of chainsWithContracts) {
      const contractsForChainPromise = enrichedContractsPromiseByChainid.get(
        pickedChain.chain.chainId,
      );
      // if no contracts found for this chain go next
      if (!contractsForChainPromise) {
        logger.log(
          `No contracts found for ${pickedChain.chain.name} (${pickedChain.chain.chainId})`,
        );
        continue;
      }
      const contractsResponse = await prompts({
        type: "autocompleteMultiselect",
        choices: (await contractsForChainPromise).map((contract) => ({
          title: contract.metadata?.name
            ? `${chalk.bold(contract.metadata.name)} ${chalk.gray(
                `(${contract.address.slice(0, 6)}...${contract.address.slice(
                  0,
                  4,
                )})`,
              )}`
            : chalk.bold(contract.address),
          value: contract,
        })),
        instructions: false,
        name: "contracts",
        message: `Which contracts do you want to use for "${pickedChain.chain.name}"?`,
      });

      pickedChain.contracts = contractsResponse.contracts;
    }

    logger.log(
      chainsWithContracts.map((ch) => ({
        chainId: ch.chain.chainId,
        contracts: ch.contracts.map((c: any) => c.address),
      })),
    );
  });
