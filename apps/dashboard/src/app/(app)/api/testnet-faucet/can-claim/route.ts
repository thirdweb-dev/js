import { getTeams } from "@/api/team";
import { NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET } from "@/constants/public-envs";
import {
  DISABLE_FAUCET_CHAIN_IDS,
  THIRDWEB_ACCESS_TOKEN,
  THIRDWEB_ENGINE_URL,
} from "@/constants/server-envs";
import { ipAddress } from "@vercel/functions";
import { cacheTtl } from "lib/redis";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { CanClaimResponseType } from "./CanClaimResponseType";

// Note: This handler cannot use "edge" runtime because of Redis usage.
export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const chainIdStr = searchParams.get("chainId");

  if (!chainIdStr) {
    return NextResponse.json(
      {
        error: "Missing chain ID parameter.",
      },
      { status: 400 },
    );
  }

  const chainId = Number.parseInt(chainIdStr);

  if (!Number.isInteger(chainId)) {
    return NextResponse.json(
      {
        error: "Invalid chain ID parameter.",
      },
      { status: 400 },
    );
  }

  // Check if faucet is disabled for this chain.
  let isFaucetDisabled = false;
  if (DISABLE_FAUCET_CHAIN_IDS) {
    try {
      const disableFaucetChainIds = DISABLE_FAUCET_CHAIN_IDS.split(",").map(
        (chainId) => Number.parseInt(chainId.trim()),
      );
      isFaucetDisabled = disableFaucetChainIds.includes(chainId);
    } catch {}
  }

  // get the teams for the account
  const teams = await getTeams();
  if (!teams) {
    const res: CanClaimResponseType = {
      canClaim: false,
      type: "paid-plan-required",
    };
    return NextResponse.json(res);
  }

  const hasPaidPlan = teams.some((team) => team.billingPlan !== "free");
  if (!hasPaidPlan) {
    const res: CanClaimResponseType = {
      canClaim: false,
      type: "paid-plan-required",
    };
    return NextResponse.json(res);
  }

  if (
    !THIRDWEB_ENGINE_URL ||
    !NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET ||
    !THIRDWEB_ACCESS_TOKEN ||
    isFaucetDisabled
  ) {
    const res: CanClaimResponseType = {
      canClaim: false,
      type: "unsupported-chain",
    };
    return NextResponse.json(res);
  }

  // CF header, fallback to req.ip, then X-Forwarded-For
  const ip =
    req.headers.get("CF-Connecting-IP") ||
    ipAddress(req) ||
    req.headers.get("X-Forwarded-For");
  if (!ip) {
    return NextResponse.json(
      {
        error: "Could not validate eligibility.",
      },
      { status: 400 },
    );
  }
  const cacheKey = `testnet-faucet:${chainId}:${ip}`;
  const ttlSeconds = await cacheTtl(cacheKey);

  const res: CanClaimResponseType = {
    canClaim: ttlSeconds <= 0,
    ttlSeconds,
    type: "throttle",
  };

  return NextResponse.json(res);
};
