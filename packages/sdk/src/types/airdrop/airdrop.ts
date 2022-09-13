import { AirdropInputSchema } from "../../schema/contracts/common/airdrop";
import { z } from "zod";

/**
 * Input model to pass a list of addresses + amount to transfer to each one
 * @public
 */
export type AirdropInput = z.input<typeof AirdropInputSchema>;
