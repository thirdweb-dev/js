import { cacheTtl } from "lib/redis";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { CanClaimResponseType } from "./CanClaimResponseType";

const THIRDWEB_ENGINE_URL = process.env.THIRDWEB_ENGINE_URL;
const NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET =
  process.env.NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET;
const THIRDWEB_ACCESS_TOKEN = process.env.THIRDWEB_ACCESS_TOKEN;

// Comma-separated list of chain IDs to disable faucet for.
const DISABLE_FAUCET_CHAIN_IDS = process.env.DISABLE_FAUCET_CHAIN_IDS;

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
  const ipAddress =
    req.headers.get("CF-Connecting-IP") ||
    req.ip ||
    req.headers.get("X-Forwarded-For");
  if (!ipAddress) {
    return NextResponse.json(
      {
        error: "Could not validate eligibility.",
      },
      { status: 400 },
    );
  }
  const cacheKey = `testnet-faucet:${chainId}:${ipAddress}`;
  const ttlSeconds = await cacheTtl(cacheKey);

  const res: CanClaimResponseType = {
    canClaim: ttlSeconds <= 0,
    ttlSeconds,
    type: "throttle",
  };

  return NextResponse.json(res);
};
