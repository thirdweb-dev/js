import { Command } from "@commander-js/extra-typings";
import { ensureAuth, getSession } from "../../auth";
import prompts from "prompts";
import { getChains } from "./chains/chain-cache";
import { getAccount } from "../../auth/account";
import { getContractsForChains } from "./contracts/account-contracts";
import { logger } from "../../utils/logger";
import chalk from "chalk";

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

    const possibleChains = await getChains({ noCache: options.cache });

    const chainResponse = await prompts({
      type: "autocompleteMultiselect",
      choices: possibleChains.map((chain) => ({
        title: `${chalk.bold(chain.name)} ${chalk.grey(`(${chain.chainId})`)}`,
        value: chain,
      })),
      instructions: false,
      name: "chains",
      message: "Which chains do you want to use?",
    });

    for (const pickedChain of chainResponse.chains) {
      const contractsForChain = await getContractsForChains(
        creatorWalletAddress,
        [{ ...pickedChain, chainId: parseInt(pickedChain.chainId) }],
        secretKey,
      );
      // if no contracts found for this chain go next
      if (contractsForChain.length === 0) {
        logger.log(
          `No contracts found for ${pickedChain.name} (${pickedChain.chainId})`,
        );
        continue;
      }
      const contractsResponse = await prompts({
        type: "autocompleteMultiselect",
        choices: contractsForChain.map((contract) => ({
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
        message: `Which contracts do you want to use for "${pickedChain.name}"?`,
      });

      pickedChain.contracts = contractsResponse.contracts;
    }

    console.log(
      chainResponse.chains.map((ch: any) => ({
        chainId: ch.chainId,
        contracts: ch.contracts.map((c: any) => c.address),
      })),
    );
  });
