import { AmountSchema } from "../../core/schema/shared";
import {
  getNativeTokenByChainId,
  NATIVE_TOKEN_ADDRESS,
} from "../constants/currency";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import { Amount, Currency, CurrencyValue, Price } from "../types/currency";
import { BaseERC20 } from "../types/eips";
import type { IERC20, IERC20Metadata } from "@thirdweb-dev/contracts-js";
import ERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC20.json";
import ERC20MetadataAbi from "@thirdweb-dev/contracts-js/dist/abis/IERC20Metadata.json";
import {
  BigNumber,
  BigNumberish,
  Contract,
  constants,
  providers,
  utils,
  ethers,
} from "ethers";

export function isNativeToken(tokenAddress: string): boolean {
  return (
    tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS ||
    tokenAddress.toLowerCase() === constants.AddressZero
  );
}

export function cleanCurrencyAddress(currencyAddress: string): string {
  if (isNativeToken(currencyAddress)) {
    return NATIVE_TOKEN_ADDRESS;
  }
  return currencyAddress;
}

/**
 *
 * @param provider
 * @param inputPrice
 * @param currencyAddress
 * @returns
 * @internal
 */
export async function normalizePriceValue(
  provider: providers.Provider,
  inputPrice: Price,
  currencyAddress: string,
) {
  const metadata = await fetchCurrencyMetadata(provider, currencyAddress);
  return utils.parseUnits(AmountSchema.parse(inputPrice), metadata.decimals);
}

/**
 *
 * @param provider
 * @param asset
 * @returns
 * @internal
 */
export async function fetchCurrencyMetadata(
  provider: providers.Provider,
  asset: string,
): Promise<Currency> {
  if (isNativeToken(asset)) {
    const network = await provider.getNetwork();
    const nativeToken = getNativeTokenByChainId(network.chainId);
    return {
      name: nativeToken.name,
      symbol: nativeToken.symbol,
      decimals: nativeToken.decimals,
    };
  } else {
    const erc20 = new Contract(
      asset,
      ERC20MetadataAbi,
      provider,
    ) as IERC20Metadata;
    const [name, symbol, decimals] = await Promise.all([
      erc20.name(),
      erc20.symbol(),
      erc20.decimals(),
    ]);
    return {
      name,
      symbol,
      decimals,
    };
  }
}

/**
 *
 * @param providerOrSigner
 * @param asset
 * @param price
 * @returns
 * @internal
 */
export async function fetchCurrencyValue(
  providerOrSigner: providers.Provider,
  asset: string,
  price: BigNumberish,
): Promise<CurrencyValue> {
  const metadata = await fetchCurrencyMetadata(providerOrSigner, asset);
  return {
    ...metadata,
    value: BigNumber.from(price),
    displayValue: utils.formatUnits(price, metadata.decimals),
  };
}

export async function setErc20Allowance(
  contractToApprove: ContractWrapper<any>,
  value: BigNumber,
  currencyAddress: string,
  overrides: any,
): Promise<any> {
  if (isNativeToken(currencyAddress)) {
    overrides["value"] = value;
  } else {
    const signer = contractToApprove.getSigner();
    const provider = contractToApprove.getProvider();
    const erc20 = new ContractWrapper<IERC20>(
      signer || provider,
      currencyAddress,
      ERC20Abi,
      {},
    );

    const owner = await contractToApprove.getSignerAddress();
    const spender = contractToApprove.readContract.address;
    const allowance = await erc20.readContract.allowance(owner, spender);
    if (allowance.lt(value)) {
      // approve overrides the previous allowance, set it to the minimum required for this tx
      await erc20.sendTransaction("approve", [spender, value]);
    }
    return overrides;
  }
}

export async function approveErc20Allowance(
  contractToApprove: ContractWrapper<any>,
  currencyAddress: string,
  price: BigNumber,
  quantity: BigNumberish,
  tokenDecimals: number,
) {
  const signer = contractToApprove.getSigner();
  const provider = contractToApprove.getProvider();
  const erc20 = new ContractWrapper<IERC20>(
    signer || provider,
    currencyAddress,
    ERC20Abi,
    {},
  );
  const owner = await contractToApprove.getSignerAddress();
  const spender = contractToApprove.readContract.address;
  const allowance = await erc20.readContract.allowance(owner, spender);
  const totalPrice = BigNumber.from(price)
    .mul(BigNumber.from(quantity))
    .div(ethers.utils.parseUnits("1", tokenDecimals));
  if (allowance.lt(totalPrice)) {
    await erc20.sendTransaction("approve", [
      spender,
      allowance.add(totalPrice),
    ]);
  }
}

export async function hasERC20Allowance(
  contractToApprove: ContractWrapper<any>,
  currencyAddress: string,
  value: BigNumber,
) {
  const provider = contractToApprove.getProvider();
  const erc20 = new ContractWrapper<IERC20>(
    provider,
    currencyAddress,
    ERC20Abi,
    {},
  );
  const owner = await contractToApprove.getSignerAddress();
  const spender = contractToApprove.readContract.address;
  const allowance = await erc20.readContract.allowance(owner, spender);
  return allowance.gte(value);
}

export async function normalizeAmount(
  contractWrapper: ContractWrapper<BaseERC20>,
  amount: Amount,
): Promise<BigNumber> {
  const decimals = await contractWrapper.readContract.decimals();
  return utils.parseUnits(AmountSchema.parse(amount), decimals);
}

export function toEther(amount: Amount): string {
  return utils.formatEther(AmountSchema.parse(amount));
}

export function toWei(amount: BigNumber | string): BigNumber {
  return utils.parseEther(AmountSchema.parse(amount));
}

export function toUnits(amount: Amount, decimals: number): BigNumber {
  return utils.parseUnits(AmountSchema.parse(amount), decimals);
}

export function formatUnits(
  amount: BigNumber | string,
  decimals: number,
): string {
  return utils.formatUnits(AmountSchema.parse(amount), decimals);
}
