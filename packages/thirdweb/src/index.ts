// convince abitype that things are OK
declare module "abitype" {
  export interface Register {
    AddressType: string;
  }
}

// client
export { createClient, type CreateClientOptions } from "./client/client.js";

// contract
export { contract, type ContractOptions } from "./contract/index.js";
