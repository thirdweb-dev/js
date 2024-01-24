// convince abitype that things are OK
declare module "abitype" {
  export interface Register {
    AddressType: string;
  }
}

// client
export {
  createClient,
  type CreateClientOptions,
  type ThirdwebClient,
} from "./client/client.js";

// contract
export {
  contract,
  type ContractOptions,
  type ThirdwebContract,
} from "./contract/index.js";
