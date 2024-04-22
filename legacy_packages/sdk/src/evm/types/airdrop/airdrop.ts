import {
  Airdrop1155ContentInput,
  Airdrop1155OutputSchema,
  Airdrop20ContentInput,
  Airdrop20OutputSchema,
  Airdrop721ContentInput,
  Airdrop721OutputSchema,
  AirdropInputSchema,
  AirdropSignature1155PayloadInput,
  AirdropSignature1155PayloadOutput,
  AirdropSignature20PayloadInput,
  AirdropSignature20PayloadOutput,
  AirdropSignature721PayloadInput,
  AirdropSignature721PayloadOutput,
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

/**
 * @public
 */
export type AirdropPayloadToSign20 = z.input<typeof AirdropSignature20PayloadInput>;

/**
 * @public
 */
export type AirdropPayloadToSign721 = z.input<typeof AirdropSignature721PayloadInput>;

/**
 * @public
 */
export type AirdropPayloadToSign1155 = z.input<typeof AirdropSignature1155PayloadInput>;

/**
 * @public
 */
export type SignedAirdropPayload20 = {
  payload: z.output<typeof AirdropSignature20PayloadOutput>;
  signature: string;
};

/**
 * @public
 */
export type SignedAirdropPayload721 = {
  payload: z.output<typeof AirdropSignature721PayloadOutput>;
  signature: string;
};

/**
 * @public
 */
export type SignedAirdropPayload1155 = {
  payload: z.output<typeof AirdropSignature1155PayloadOutput>;
  signature: string;
};

export const AirdropContentERC20 = [
  { name: "recipient", type: "address" },
  { name: "amount", type: "uint256" },
]

export const AirdropContentERC721 = [
  { name: "recipient", type: "address" },
  { name: "tokenId", type: "uint256" },
]

export const AirdropContentERC1155 = [
  { name: "recipient", type: "address" },
  { name: "tokenId", type: "uint256" },
  { name: "amount", type: "uint256" },
]

export const AirdropRequestERC20 = [
  { name: "uid", type: "bytes32" },
  { name: "tokenAddress", type: "address" },
  { name: "expirationTimestamp", type: "uint256" },
  { name: "contents", type: "AirdropContentERC20[]" },
];

export const AirdropRequestERC721 = [
  { name: "uid", type: "bytes32" },
  { name: "tokenAddress", type: "address" },
  { name: "expirationTimestamp", type: "uint256" },
  { name: "contents", type: "AirdropContentERC721[]" },
];

export const AirdropRequestERC1155 = [
  { name: "uid", type: "bytes32" },
  { name: "tokenAddress", type: "address" },
  { name: "expirationTimestamp", type: "uint256" },
  { name: "contents", type: "AirdropContentERC1155[]" },
];
