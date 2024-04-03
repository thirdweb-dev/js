import { PrecomputedDeploymentTransaction } from "../../types/any-evm/deploy-data";
import { GAS_LIMIT_FOR_DEPLOYER } from "./constants";
import { estimateGasForDeploy } from "./estimateGasForDeploy";

/**
 * @internal
 */
export function createTransactionBatches(
  transactions: PrecomputedDeploymentTransaction[],
  upperGasLimit: number = GAS_LIMIT_FOR_DEPLOYER,
): PrecomputedDeploymentTransaction[][] {
  transactions = transactions.filter((tx) => {
    return tx.data.length > 0;
  });
  if (transactions.length === 0) {
    return [];
  }

  const transactionBatches: PrecomputedDeploymentTransaction[][] = [];
  let sum = 0;
  let batch: PrecomputedDeploymentTransaction[] = [];
  transactions.forEach((tx) => {
    const gas = estimateGasForDeploy(tx.data);
    if (sum + gas > upperGasLimit) {
      if (batch.length === 0) {
        transactionBatches.push([tx]);
      } else {
        transactionBatches.push(batch);
        sum = gas;
        batch = [tx];
      }
    } else {
      sum += gas;
      batch.push(tx);
    }
  });
  if (batch.length > 0) {
    transactionBatches.push(batch);
  }

  return transactionBatches;
}
