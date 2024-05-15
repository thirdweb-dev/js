import {
  ClaimConditionInputSchema,
  ClaimConditionOutputSchema,
} from "../../schema/contracts/common/claim-conditions";
import type {
  ClaimConditionInput,
  ClaimCondition,
} from "../../types/claim-conditions/claim-conditions";
import { utils } from "ethers";

/**
 * @internal
 * @param index - The index of the condition to update
 * @param claimConditionInput - The input claim condition to update
 * @param existingConditions - The existing claim conditions
 */
export async function updateExistingClaimConditions(
  index: number,
  claimConditionInput: ClaimConditionInput,
  existingConditions: ClaimCondition[],
): Promise<ClaimConditionInput[]> {
  if (index >= existingConditions.length) {
    throw Error(
      `Index out of bounds - got index: ${index} with ${existingConditions.length} conditions`,
    );
  }
  // merge input with existing claim condition
  const priceDecimals = existingConditions[index].currencyMetadata.decimals;
  const priceInWei = existingConditions[index].price;
  const priceInTokens = utils.formatUnits(priceInWei, priceDecimals);

  // merge existing (output format) with incoming (input format)
  const newConditionParsed = await ClaimConditionInputSchema.parseAsync({
    ...existingConditions[index],
    price: priceInTokens,
    ...claimConditionInput,
  });

  // convert to output claim condition
  const mergedConditionOutput = await ClaimConditionOutputSchema.parseAsync({
    ...newConditionParsed,
    price: priceInWei,
  });

  return existingConditions.map((existingOutput, i) => {
    let newConditionAtIndex;
    if (i === index) {
      newConditionAtIndex = mergedConditionOutput;
    } else {
      newConditionAtIndex = existingOutput;
    }
    const formattedPrice = utils.formatUnits(
      newConditionAtIndex.price,
      priceDecimals,
    );
    return {
      ...newConditionAtIndex,
      price: formattedPrice, // manually transform back to input price type
    };
  });
}
