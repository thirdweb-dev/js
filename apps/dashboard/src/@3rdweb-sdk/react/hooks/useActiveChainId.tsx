import type { ChainMetadata } from "thirdweb/chains";

export type EVMContractInfo = {
  // using null instead of undefined here so that this type can be JSON stringified
  chain: ChainMetadata | null;
  chainSlug: string;
  contractAddress: string;
};
