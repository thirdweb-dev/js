import type { Address } from "abitype";
import type { BiconomyOptions } from "./providers/biconomy.js";
import type { OpenZeppelinOptions } from "./providers/openzeppelin.js";

export type GaslessOptions =
  | {
      provider: "engine";
      relayerUrl: string;
      realyerForwarderAddress: Address;
      domainName?: string; // default: "GSNv2 Forwarder"
      domainVersion?: string; // default: "0.0.1"
      domainSeparatorVersion?: string; // default: "1"
      experimentalChainlessSupport?: boolean; // default: false
    }
  | OpenZeppelinOptions
  | BiconomyOptions;
