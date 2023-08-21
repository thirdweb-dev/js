import {
  Airdrop1155ContentInput,
  Airdrop1155OutputSchema,
  Airdrop20ContentInput,
  Airdrop20OutputSchema,
  Airdrop721ContentInput,
  Airdrop721OutputSchema,
  AirdropInputSchema,
} from "../../schema/contracts/common/airdrop";
import { z } from "zod";

/**
 * Input model to pass a list of addresses + amount to transfer to each one
 * @public
 */
export type AirdropInput = z.input<typeof AirdropInputSchema>;

export type Airdrop20Content = z.input<typeof Airdrop20ContentInput>;
export type Airdrop20Output = z.input<typeof Airdrop20OutputSchema>;

export type Airdrop721Content = z.input<typeof Airdrop721ContentInput>;
export type Airdrop721Output = z.input<typeof Airdrop721OutputSchema>;

export type Airdrop1155Content = z.input<typeof Airdrop1155ContentInput>;
export type Airdrop1155Output = z.input<typeof Airdrop1155OutputSchema>;
