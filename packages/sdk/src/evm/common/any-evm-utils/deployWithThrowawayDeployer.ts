import { ContractFactory, type Signer } from "ethers";
import { PrecomputedDeploymentTransaction } from "../../types/any-evm/deploy-data";
import type { DeployOptions } from "../../types/deploy/deploy-options";
import { DEPLOYER_ABI, DEPLOYER_BYTECODE } from "./constants";
import { createTransactionBatches } from "./createTransactionBatches";

/**
 * @internal
 */
export async function deployWithThrowawayDeployer(
  signer: Signer,
  transactions: PrecomputedDeploymentTransaction[],
  options?: DeployOptions,
) {
  const transactionBatches = createTransactionBatches(transactions);
  if (transactionBatches.length === 0) {
    return;
  }

  options?.notifier?.("deploying", "infra");
  const deployTxns = await Promise.all(
    transactionBatches.map((txBatch) => {
      // Using the deployer contract, send the deploy transactions to common factory with a signer
      const deployer = new ContractFactory(DEPLOYER_ABI, DEPLOYER_BYTECODE)
        .connect(signer)
        .deploy(txBatch);

      return deployer;
    }),
  );

  await Promise.all(
    deployTxns.map((tx) => {
      return tx.deployed();
    }),
  );
  options?.notifier?.("deployed", "infra");
}
