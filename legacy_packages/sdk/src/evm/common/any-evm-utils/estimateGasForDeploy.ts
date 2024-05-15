import { utils } from "ethers";

/**
 * @internal
 */
export function estimateGasForDeploy(initCode: string) {
  let gasLimit =
    utils
      .arrayify(initCode)
      .map((x) => (x === 0 ? 4 : 16))
      .reduce((sum, x) => sum + x) +
    (200 * initCode.length) / 2 +
    6 * Math.ceil(initCode.length / 64) +
    32000 +
    21000;

  gasLimit = Math.floor((gasLimit * 64) / 63);

  return gasLimit;
}
