import { CurrencyValue } from "../../core/schema/token";
import { Amount } from "@metaplex-foundation/js";
import BN from "bn.js";

/**
 * @internal
 */
export function toCurrencyValue(amount: Amount): CurrencyValue {
  return {
    value: amount.basisPoints.toString(),
    displayValue: toDisplayValue(amount),
  };
}

const toDisplayValue = (value: Amount): string => {
  if (value.currency.decimals === 0) {
    return `${value.currency.symbol} ${value.basisPoints.toString()}`;
  }

  const power = new BN(10).pow(new BN(value.currency.decimals));
  const basisPoints = value.basisPoints as unknown as BN & {
    divmod: (other: BN) => { div: BN; mod: BN };
  };

  const { div, mod } = basisPoints.divmod(power);
  const units = `${div.toString()}.${mod
    .abs()
    .toString(10, value.currency.decimals)}`;

  return `${units}`;
};
