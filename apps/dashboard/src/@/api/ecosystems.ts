import "server-only";

import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { getAuthToken } from "./auth-token";

export type AuthOption =
  | "email"
  | "phone"
  | "passkey"
  | "siwe"
  | "guest"
  | "google"
  | "facebook"
  | "x"
  | "discord"
  | "farcaster"
  | "telegram"
  | "github"
  | "twitch"
  | "steam"
  | "apple"
  | "coinbase"
  | "line";

export type Ecosystem = {
  name: string;
  imageUrl?: string;
  id: string;
  slug: string;
  permission: "PARTNER_WHITELIST" | "ANYONE";
  authOptions: AuthOption[];
  customAuthOptions?: {
    authEndpoint?: {
      url: string;
      headers?: { key: string; value: string }[];
    };
    jwt?: {
      jwksUri: string;
      aud: string;
    };
  } | null;
  smartAccountOptions?: {
    defaultChainId: number;
    sponsorGas: boolean;
    accountFactoryAddress?: string;
    executionMode?: "EIP4337" | "EIP7702";
  } | null;
  url: string;
  status: "active" | "requested" | "paymentFailed";
  createdAt: string;
  updatedAt: string;
};

export async function fetchEcosystemList(teamIdOrSlug: string) {
  const token = await getAuthToken();

  if (!token) {
    return [];
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${teamIdOrSlug}/ecosystem-wallet`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    return [];
  }

  return (await res.json()).result as Ecosystem[];
}

export async function fetchEcosystem(slug: string, teamIdOrSlug: string) {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${teamIdOrSlug}/ecosystem-wallet/${slug}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) {
    const data = await res.json();
    console.error(data);
    return null;
  }

  const data = (await res.json()) as { result: Ecosystem };
  return data.result;
}

type PartnerPermission = "PROMPT_USER_V1" | "FULL_CONTROL_V1";
export type Partner = {
  id: string;
  name: string;
  allowlistedDomains: string[];
  allowlistedBundleIds: string[];
  permissions: [PartnerPermission];
  createdAt: string;
  updatedAt: string;
  accessControl?: {
    serverVerifier?: {
      url: string;
      headers?: { key: string; value: string }[];
    };
    allowedOperations?: AllowedOperations[];
  };
};

type AllowedArgument = {
  offset: number;
  type: "address" | "uint256" | "bytes32" | "bool" | "string";
  comparisonOperator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte";
  value: string;
};

type AllowedTransaction = {
  chainId: number;
  contractAddress?: string;
  selector?: string;
  arguments?: AllowedArgument[];
  maxValue?: string;
};

type AllowedTypedData = {
  domain: string;
  verifyingContract?: string;
  chainId?: number;
  primaryType?: string;
};

type PersonalSignRestriction =
  | {
      messageType: "userOp";
      allowedTransactions?: AllowedTransaction[];
    }
  | {
      messageType: "other";
      message?: string;
    };

type AllowedOperations =
  | {
      signMethod: "eth_signTransaction";
      allowedTransactions?: AllowedTransaction[];
    }
  | {
      signMethod: "eth_signTypedData_v4";
      allowedTypedData?: AllowedTypedData[];
    }
  | {
      signMethod: "personal_sign";
      allowedPersonalSigns?: PersonalSignRestriction[];
    };
