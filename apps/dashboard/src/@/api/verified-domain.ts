"use server";
import "server-only";

import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "../constants/public-envs";

export type VerifiedDomainResponse =
  | {
      status: "pending";
      domain: string;
      dnsSublabel: string;
      dnsValue: string;
    }
  | {
      status: "verified";
      domain: string;
      verifiedAt: Date;
    };

export async function checkDomainVerification(
  teamIdOrSlug: string,
): Promise<VerifiedDomainResponse | null> {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${teamIdOrSlug}/verified-domain`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (res.ok) {
    return (await res.json())?.result as VerifiedDomainResponse;
  }

  return null;
}

export async function createDomainVerification(
  teamIdOrSlug: string,
  domain: string,
): Promise<VerifiedDomainResponse | { error: string }> {
  const token = await getAuthToken();

  if (!token) {
    return {
      error: "Unauthorized",
    };
  }

  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${teamIdOrSlug}/verified-domain`,
    {
      body: JSON.stringify({ domain }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (res.ok) {
    return (await res.json())?.result as VerifiedDomainResponse;
  }

  const resJson = (await res.json()) as {
    error: {
      code: string;
      message: string;
      statusCode: number;
    };
  };

  switch (resJson?.error?.statusCode) {
    case 400:
      return {
        error: "The domain you provided is not valid.",
      };
    case 409:
      return {
        error: "This domain is already verified by another team.",
      };
    default:
      return {
        error: resJson?.error?.message ?? "Failed to verify domain",
      };
  }
}
