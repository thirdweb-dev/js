import { Airdrop1155ContentInput, Airdrop20ContentInput, Airdrop721ContentInput, AirdropInputSchema } from "../../schema/contracts/common/airdrop";
import { z } from "zod";

/**
 * Input model to pass a list of addresses + amount to transfer to each one
 * @public
 */
export type AirdropInput = z.input<typeof AirdropInputSchema>;

export type Airdrop20Content = z.input<typeof Airdrop20ContentInput>;

export type Airdrop721Content = z.input<typeof Airdrop721ContentInput>;

export type Airdrop1155Content = z.input<typeof Airdrop1155ContentInput>;
