import { cacheGet, cacheSet } from "lib/redis";
import { type NextRequest, NextResponse } from "next/server";
import { ZERO_ADDRESS } from "thirdweb";

interface RequestTestnetFundsPayload {
  chainId: number;
  toAddress: string;
}

// Note: This handler cannot use "edge" runtime because of Redis usage.
export const POST = async (req: NextRequest) => {
  const requestBody = (await req.json()) as RequestTestnetFundsPayload;
  const { chainId, toAddress } = requestBody;
  if (Number.isNaN(chainId)) {
    throw new Error("Invalid chain ID.");
  }

  const THIRDWEB_ENGINE_URL = process.env.THIRDWEB_ENGINE_URL;
  const NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET =
    process.env.NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET;
  const THIRDWEB_ACCESS_TOKEN = process.env.THIRDWEB_ACCESS_TOKEN;

  if (
    !THIRDWEB_ENGINE_URL ||
    !NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET ||
    !THIRDWEB_ACCESS_TOKEN
  ) {
    return NextResponse.json(
      { error: "Testnet faucet not configured." },
      { status: 500 },
    );
  }

  // vercel provides this for us in the request object || fall back to the header
  const ipAddress = req.ip || req.headers.get("X-Forwarded-For");
  if (!ipAddress) {
    return NextResponse.json(
      {
        error: "Could not validate elligibility.",
      },
      { status: 400 },
    );
  }

  const cacheKey = `testnet-faucet:${chainId}:${ipAddress}`;

  // Assert 1 request per IP/chain every 24 hours.
  // get the cached value
  const cachedValue = await cacheGet(cacheKey);
  // if we have a cached value, return an error
  if (cachedValue !== null) {
    return NextResponse.json(
      { error: "Already requested funds on this chain in the past 24 hours." },
      { status: 429 },
    );
  }

  try {
    // Store the claim request for 24 hours.
    await cacheSet(cacheKey, "claimed", 24 * 60 * 60);
    // then actually transfer the funds
    const url = `${THIRDWEB_ENGINE_URL}/backend-wallet/${chainId}/transfer`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-backend-wallet-address": NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET,
        Authorization: `Bearer ${THIRDWEB_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: toAddress,
        currencyAddress: ZERO_ADDRESS,
        amount: "0.01",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error.error;
    }
  } catch (error) {
    return NextResponse.json(
      { error: `${(error as Error)?.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ amount: "0.01" }, { status: 200 });
};
