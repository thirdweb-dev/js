import type { Address } from "abitype";
import type { Prettify } from "../../../utils/type-utils.js";
import type { BiconomyOptions } from "./providers/biconomy.js";

export type GaslessOptions = Prettify<
  | {
      provider: "engine";
      relayerUrl: string;
      realyerForwarderAddress: Address;
      domainName?: string; // default: "GSNv2 Forwarder"
      domainVersion?: string; // default: "0.0.1"
      domainSeparatorVersion?: string; // default: "1"
      experimentalChainlessSupport?: boolean; // default: false
    }
  | {
      provider: "openzeppelin";
      relayerUrl: string;
      relayerForwarderAddress: Address;
      useEOAForwarder?: boolean; // default: false
      domainName?: string; // default: "GSNv2 Forwarder"
      domainVersion?: string; // default: "0.0.1"
      domainSeparatorVersion?: string; // default: "1"
      experimentalChainlessSupport?: boolean; // default: false
    }
  | BiconomyOptions
>;
