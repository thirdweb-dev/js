import type {
  Address,
  TypedData,
  TypedDataDomain,
  TypedDataToPrimitiveTypes,
} from "abitype";
import type { EthereumTypedTransaction } from "./transaction-types.js";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Encrypted types
export type EncryptedPayload = {
  ephemeralPublicKey: string;
  nonce: string;
  ciphertext: string;
};

// ========== Authentication Types ==========
type AdminKeyAuth = {
  adminKey: string;
};

type AccessTokenAuth = {
  accessToken: string;
};

type SessionTokenAuth = {
  sessionToken: string;
};

// Regular Auth union (excluding RotationCodeAuth)
export type Auth = AdminKeyAuth | AccessTokenAuth | SessionTokenAuth;

// Separate RotationCodeAuth (used only for rotation)
type RotationCodeAuth = {
  rotationCode: string;
};

// ========== Base Types ==========
type UnencryptedError = {
  message: string;
  status: number;
  type: string;
  details?: string;
};

export type UnencryptedErrorResponse = {
  error: UnencryptedError;
};

type EncryptedError = {
  code: string;
  message: string;
  details?: string;
};

type GenericSuccessResponse<Data> = {
  success: true;
  data: Data;
  error: null;
};

type GenericErrorResponse = {
  success: false;
  data: null;
  error: EncryptedError | UnencryptedError;
};

export type VaultError = EncryptedError | UnencryptedError;

type GenericResponse<Data> =
  | GenericSuccessResponse<Data>
  | GenericErrorResponse;

// ========== Payload Type ==========
export type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type GenericPayload<
  T extends {
    operation: string;
    auth?: Auth | RotationCodeAuth | never;
    options?: Record<string, unknown> | never;
    data: unknown;
  },
> = {
  input: OmitNever<{
    operation: T["operation"];
    options: T["options"];
    auth: T["auth"];
  }>;
  output: GenericResponse<T["data"]>;
};

// ========== Options Types ==========
type CreateServiceAccountOptions = {
  metadata: Record<string, string>;
};

type MetadataValue = string | number | boolean;

type CreateEoaOptions = {
  metadata: Record<string, MetadataValue>;
};

type GetEoasOptions = {
  page?: number;
  pageSize?: number;
};

type PingOptions = {
  message: string;
};

// type Transaction = {
//   to: string;
//   value: string;
//   gasLimit: string;
//   gasPrice: string;
//   nonce: string;
//   chainId: number;
//   data: string;
// };

type SignTransactionOptions = {
  transaction: EthereumTypedTransaction;
  from: string;
};

type SignMessageOptions = {
  message: string;
  from: string;
  chainId?: number;
  format?: "text" | "hex";
};

type CheckedSignTypedDataOptions<
  Types extends TypedData,
  PrimaryType extends keyof Types | "EIP712Domain" = keyof Types,
> = {
  typedData: {
    domain: TypedDataDomain;
    types: Types;
    primaryType: PrimaryType;
    message: TypedDataToPrimitiveTypes<Types>[PrimaryType];
  };
  from: string;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type SignedTypedDataOptions = CheckedSignTypedDataOptions<any, any>;

// ========== Policy Types ==========
type RegexRule = {
  pattern: string;
};

type NumberRuleOp = "greaterThan" | "lessThan" | "equalTo";

type NumberRule = {
  op: NumberRuleOp;
  value: number | bigint;
};

type Rule = NumberRule | RegexRule;

type MetadataRule = {
  key: string;
  rule: Rule;
};

type PolicyComponent =
  | {
      type: "eoa:create";
      requiredMetadataPatterns?: MetadataRule[];
      allowedMetadataPatterns?: MetadataRule[];
    }
  | {
      type: "eoa:read";
      metadataPatterns?: MetadataRule[];
    }
  | {
      type: "eoa:signTransaction";
      allowlist?: Address[];
      metadataPatterns?: MetadataRule[];
      payloadPatterns: Record<string, Rule[]>;
    }
  | {
      type: "eoa:signMessage";
      allowlist?: Address[];
      metadataPatterns?: MetadataRule[];
      chainId?: number;
      messagePattern?: string;
    }
  | {
      type: "eoa:signTypedData";
      allowlist?: Address[];
      metadataPatterns?: MetadataRule[];
    };

type OwnerType = string; // Define based on your eoa models

type CreateAccessTokenOptions = {
  policies: PolicyComponent[];
  expiresAt: string; // ISO date string
  metadata: Record<string, MetadataValue>;
};

type RevokeAccessTokenOptions = {
  id: string; // UUID
};

// ========== Response Data Types ==========
type PingData = {
  timestamp: number;
  pong: string;
};

type CreateServiceAccountData = {
  id: string; // UUID
  adminKey: string;
  rotationCode: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

type GetServiceAccountData = {
  id: string; // UUID
  metadata: Record<string, string>;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

type RotateServiceAccountData = {
  newAdminKey: string;
  newRotationCode: string;
};

type EoaData = {
  id: string; // UUID
  address: string;
  metadata: Record<string, MetadataValue>;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

type GetEoasData = {
  items: EoaData[];
  page: number;
  pageSize: number;
  totalRecords: number;
};

type SignTransactionData = {
  signature: string;
};

type SignMessageData = {
  signature: string;
};

type SignTypedDataData = {
  signature: string;
};

type CreateAccessTokenData = {
  accessToken: string;
  id: string; // UUID
  issuerId: string; // UUID
  issuerType: OwnerType;
  policies: PolicyComponent[];
  expiresAt: string; // ISO date string
  metadata: Record<string, MetadataValue>;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  revokedAt?: string; // ISO date string
};

type RevokeAccessTokenData = {
  id: string; // UUID
  issuerId: string; // UUID
  issuerType: OwnerType;
  policies: PolicyComponent[];
  expiresAt: string; // ISO date string
  metadata: Record<string, MetadataValue>;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  revokedAt?: string; // ISO date string
};

// ========== Operation Payloads ==========
export type PingPayload = GenericPayload<{
  operation: "ping";
  options: PingOptions;
  auth: never;
  data: PingData;
}>;

export type CreateServiceAccountPayload = GenericPayload<{
  operation: "serviceAccount:create";
  options: CreateServiceAccountOptions;
  auth: never;
  data: CreateServiceAccountData;
}>;

export type GetServiceAccountPayload = GenericPayload<{
  operation: "serviceAccount:get";
  options: never;
  auth: Auth;
  data: GetServiceAccountData;
}>;

export type RotateServiceAccountPayload = GenericPayload<{
  operation: "serviceAccount:rotate";
  options: never;
  auth: RotationCodeAuth; // Only accepts RotationCodeAuth
  data: RotateServiceAccountData;
}>;

export type CreateEoaPayload = GenericPayload<{
  operation: "eoa:create";
  auth: Auth;
  options: CreateEoaOptions;
  data: EoaData;
}>;

export type ListEoaPayload = GenericPayload<{
  operation: "eoa:list";
  auth: Auth;
  options: GetEoasOptions;
  data: GetEoasData;
}>;

export type SignTransactionPayload = GenericPayload<{
  operation: "eoa:signTransaction";
  auth: Auth;
  options: SignTransactionOptions;
  data: SignTransactionData;
}>;

export type CheckedSignTypedDataPayload<
  Types extends TypedData,
  PrimaryType extends keyof Types | "EIP712Domain" = keyof Types,
> = GenericPayload<{
  operation: "eoa:signTypedData";
  auth: Auth;
  options: CheckedSignTypedDataOptions<Types, PrimaryType>;
  data: SignTypedDataData;
}>;

export type SignTypedDataPayload = GenericPayload<{
  operation: "eoa:signTypedData";
  auth: Auth;
  options: SignedTypedDataOptions;
  data: SignTypedDataData;
}>;

export type SignMessagePayload = GenericPayload<{
  operation: "eoa:signMessage";
  auth: Auth;
  options: SignMessageOptions;
  data: SignMessageData;
}>;

export type CreateAccessTokenPayload = GenericPayload<{
  operation: "accessToken:create";
  auth: Auth;
  options: CreateAccessTokenOptions;
  data: CreateAccessTokenData;
}>;

export type RevokeAccessTokenPayload = GenericPayload<{
  operation: "accessToken:revoke";
  auth: Auth;
  options: RevokeAccessTokenOptions;
  data: RevokeAccessTokenData;
}>;

// ========== Union of all payloads ==========
export type Payload =
  | PingPayload
  | CreateServiceAccountPayload
  | GetServiceAccountPayload
  | RotateServiceAccountPayload
  | CreateEoaPayload
  | ListEoaPayload
  | SignTransactionPayload
  | SignMessagePayload
  | SignTypedDataPayload
  | CreateAccessTokenPayload
  | RevokeAccessTokenPayload;
