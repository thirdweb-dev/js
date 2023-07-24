import { Contract, Signer, providers } from "ethers";
import { ERC20WithDecimalsAbi } from "../constants/erc20";

export function createErc20(
  provider: providers.Provider | Signer,
  currencyAddress: string,
) {
  return new Contract(currencyAddress, ERC20WithDecimalsAbi, provider);
}
