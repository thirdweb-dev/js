import type { Abi, AbiFunction } from "abitype";
import type { ThirdwebContract } from "./contract.js";

export type AbiOfLength<TLength> = { length: TLength };

export type AsyncGetAbiFunctionFromContract<TAbi extends Abi> = (
  contract: ThirdwebContract<TAbi>,
) => Promise<AbiFunction>;
