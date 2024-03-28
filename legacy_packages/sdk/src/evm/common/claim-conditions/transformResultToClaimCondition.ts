import {
  AbstractClaimConditionContractStruct,
  ClaimConditionOutputSchema,
} from "../../schema/contracts/common/claim-conditions";
import type { ClaimCondition } from "../../types/claim-conditions/claim-conditions";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, providers } from "ethers";
import { fetchCurrencyValue } from "../currency/fetchCurrencyValue";
import { fetchSnapshot } from "./fetchSnapshot";
import { convertToReadableQuantity } from "./convertToReadableQuantity";

/**
 * Transforms a contract model to local model
 * @param pm - The contract model to transform
 * @param tokenDecimals - The token decimals to use
 * @param provider - The provider to use
 * @param merkleMetadata - The merkle metadata to use
 * @param storage - The storage to use
 * @param shouldDownloadSnapshot - Whether to download the snapshot
 * @internal
 */
export async function transformResultToClaimCondition(
  pm: AbstractClaimConditionContractStruct,
  tokenDecimals: number,
  provider: providers.Provider,
  merkleMetadata: Record<string, string> | undefined,
  storage: ThirdwebStorage,
  shouldDownloadSnapshot: boolean,
): Promise<ClaimCondition> {
  const cv = await fetchCurrencyValue(provider, pm.currency, pm.pricePerToken);

  const maxClaimableSupply = convertToReadableQuantity(
    pm.maxClaimableSupply,
    tokenDecimals,
  );
  const maxClaimablePerWallet = convertToReadableQuantity(
    pm.maxClaimablePerWallet,
    tokenDecimals,
  );
  const availableSupply = convertToReadableQuantity(
    BigNumber.from(pm.maxClaimableSupply).sub(pm.supplyClaimed),
    tokenDecimals,
  );
  const currentMintSupply = convertToReadableQuantity(
    pm.supplyClaimed,
    tokenDecimals,
  );
  let resolvedMetadata;
  if (pm.metadata) {
    resolvedMetadata = await storage.downloadJSON(pm.metadata);
  }
  return ClaimConditionOutputSchema.parseAsync({
    startTime: pm.startTimestamp,
    maxClaimableSupply,
    maxClaimablePerWallet,
    currentMintSupply,
    availableSupply,
    waitInSeconds: pm.waitTimeInSecondsBetweenClaims?.toString(),
    price: BigNumber.from(pm.pricePerToken),
    currency: pm.currency,
    currencyAddress: pm.currency,
    currencyMetadata: cv,
    merkleRootHash: pm.merkleRoot,
    snapshot: shouldDownloadSnapshot
      ? await fetchSnapshot(pm.merkleRoot, merkleMetadata, storage)
      : undefined,
    metadata: resolvedMetadata,
  });
}
