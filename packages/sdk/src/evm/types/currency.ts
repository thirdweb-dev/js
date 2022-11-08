/**
 * Currency metadata.
 * @public
 */
import { AmountSchema } from "../../core/schema/shared";
import {
  CurrencySchema,
  CurrencyValueSchema,
} from "../schema/contracts/common/currency";
import { z } from "zod";

/**
 * @public
 */
export type Currency = z.infer<typeof CurrencySchema>;

export interface NativeToken extends Currency {
  // native tokens all have 18 decimals
  decimals: 18;
  wrapped: {
    address: string;
    name: string;
    symbol: string;
  };
}

/**
 * Currency metadata & value.
 * @public
 */
export type CurrencyValue = z.infer<typeof CurrencyValueSchema>;

/**
 * A token holder address and its current balance
 */
export type TokenHolderBalance = { holder: string; balance: CurrencyValue };

/**
 * Represents a currency price already formatted. ie. "1" for 1 ether.
 * @public
 */
export type Price = z.input<typeof AmountSchema>;

/**
 * Represents a currency amount already formatted. ie. "1" for 1 ether.
 * @public
 */
export type Amount = z.input<typeof AmountSchema>;
