import { Signer, WalletAdapter } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { z } from "zod";

/**
 * @internal
 */
const PropertiesInput = /* @__PURE__ */ (() =>
  z.object({}).catchall(z.unknown()))();

/**
 * @internal
 */
export const OptionalPropertiesInput = /* @__PURE__ */ (() =>
  z.union([z.array(PropertiesInput), PropertiesInput]).optional())();

/**
 * @internal
 */
export const RawDateSchema = /* @__PURE__ */ (() =>
  z.date().transform((i) => {
    return Math.floor(i.getTime() / 1000);
  }))();

/**
 * @internal
 */
export type TransactionResult = {
  signature: string;
};

/**
 * @internal
 */
export type WalletSigner = Signer | WalletAdapter;

/**
 * @internal
 */
export type AccountType = "nft-collection" | "nft-drop" | "token";

/**
 * @internal
 */
export type WalletAccount = {
  type: AccountType;
  address: string;
  name: string;
};

/**
 * @internal
 */
export const AddressSchema = /* @__PURE__ */ (() =>
  z.union([
    z.string(),
    z.instanceof(PublicKey).transform((key) => key.toBase58()),
  ]))();
