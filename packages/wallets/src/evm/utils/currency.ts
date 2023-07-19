import {
  BigNumber,
  BigNumberish,
  Contract,
  Signer,
  constants,
  providers,
  utils,
} from "ethers";
import { ERC20WithDecimalsAbi } from "../constants/erc20";

export const NATIVE_TOKEN_ADDRESS =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export function isNativeToken(tokenAddress: string) {
  return (
    tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS ||
    tokenAddress.toLowerCase() === constants.AddressZero
  );
}

export function createErc20(
  provider: providers.Provider | Signer,
  currencyAddress: string,
) {
  return new Contract(currencyAddress, ERC20WithDecimalsAbi, provider);
}

export async function normalizePriceValue(
  provider: providers.Provider,
  currencyAddress: string,
  price: BigNumberish,
) {
  // Note: assumes that native tokens are 18 decimals, which isn't always the case
  let decimals = 18;
  if (!isNativeToken(currencyAddress)) {
    const erc20 = createErc20(provider, currencyAddress);
    decimals = (await erc20.decimals()) as number;
  }

  return utils.parseUnits(BigNumber.from(price).toString(), decimals);
}

export async function fetchCurrencyValue(
  provider: providers.Provider,
  currencyAddress: string,
  price: BigNumberish,
) {
  // Note: assumes that native tokens are 18 decimals, which isn't always the case
  let decimals = 18;
  if (!isNativeToken(currencyAddress)) {
    const erc20 = createErc20(provider, currencyAddress);
    decimals = (await erc20.decimals()) as number;
  }

  return {
    value: BigNumber.from(price),
    displayValue: utils.formatUnits(price, decimals),
  };
}
