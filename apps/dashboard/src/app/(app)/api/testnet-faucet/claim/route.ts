import { ipAddress } from "@vercel/functions";
import { startOfToday } from "date-fns";
import { type NextRequest, NextResponse } from "next/server";
import { getAddress, ZERO_ADDRESS } from "thirdweb";
import { getTeams } from "@/api/team";
import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import {
  NEXT_PUBLIC_THIRDWEB_API_HOST,
  NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET,
} from "@/constants/public-envs";
import {
  THIRDWEB_ACCESS_TOKEN,
  THIRDWEB_ENGINE_URL,
  TURNSTILE_SECRET_KEY,
} from "@/constants/server-envs";
import type { Account } from "@/hooks/useApi";
import { cacheGet, cacheSet } from "@/lib/redis";
import { getFaucetClaimAmount } from "./claim-amount";

interface RequestTestnetFundsPayload {
  chainId: number;
  toAddress: string;

  // Cloudflare Turnstile token received from the client-side
  turnstileToken: string;
}

/**
 * How this endpoint works:
 * Only users who have signed in to thirdweb.com with an account that is email-verified can claim.
 * Those who satisfy the requirement above can claim once per 24 hours for every account
 *
 * Note: This handler cannot use "edge" runtime because of Redis usage.
 */
export const POST = async (req: NextRequest) => {
  // Make sure user's connected to the site
  const activeAccount = req.cookies.get(COOKIE_ACTIVE_ACCOUNT)?.value;

  if (!activeAccount) {
    return NextResponse.json(
      {
        error: "No wallet detected",
      },
      { status: 400 },
    );
  }
  const authCookieName = COOKIE_PREFIX_TOKEN + getAddress(activeAccount);

  const authCookie = req.cookies.get(authCookieName);

  if (!authCookie) {
    return NextResponse.json(
      {
        error: "No wallet connected",
      },
      { status: 400 },
    );
  }

  const requestBody = (await req.json()) as RequestTestnetFundsPayload;
  const { chainId, toAddress, turnstileToken } = requestBody;
  if (Number.isNaN(chainId)) {
    throw new Error("Invalid chain ID.");
  }

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

  // CF header, fallback to req.ip, then X-Forwarded-For
  const ip =
    req.headers.get("CF-Connecting-IP") ||
    ipAddress(req) ||
    req.headers.get("X-Forwarded-For");
  if (!ip) {
    return NextResponse.json(
      {
        error: "Could not validate elligibility.",
      },
      { status: 400 },
    );
  }

  if (!turnstileToken) {
    return NextResponse.json(
      {
        error: "Missing Turnstile token.",
      },
      { status: 400 },
    );
  }

  // https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
  // Validate the token by calling the "/siteverify" API endpoint.
  const result = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      body: JSON.stringify({
        remoteip: ip,
        response: turnstileToken,
        secret: TURNSTILE_SECRET_KEY,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  const outcome = await result.json();
  if (!outcome.success) {
    return NextResponse.json(
      {
        error: "Could not validate captcha.",
      },
      { status: 400 },
    );
  }

  // Make sure the connected wallet has a thirdweb account
  const accountRes = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/account/me`,
    {
      headers: {
        Authorization: `Bearer ${authCookie.value}`,
      },
      method: "GET",
    },
  );

  if (accountRes.status !== 200) {
    // Account not found on this connected address
    return NextResponse.json(
      {
        error: "thirdweb account not found",
      },
      { status: 400 },
    );
  }

  const account: { data: Account } = await accountRes.json();

  // Make sure the logged-in account has verified its email
  if (!account.data.email) {
    return NextResponse.json(
      {
        error: "Account owner hasn't verified email",
      },
      { status: 400 },
    );
  }

  // get the teams for the account
  const teams = await getTeams();
  if (!teams) {
    return NextResponse.json(
      {
        error: "No teams found for this account.",
      },
      {
        status: 500,
      },
    );
  }
  // check if ANY of the customer's teams has "growth" or "pro" plan
  const hasPaidPlan = teams.some((team) => team.billingPlan !== "free");
  if (!hasPaidPlan) {
    return NextResponse.json(
      {
        error: "Free plan cannot claim on this chain.",
      },
      {
        status: 402,
      },
    );
  }

  const ipCacheKey = `testnet-faucet:${chainId}:${ip}`;
  const addressCacheKey = `testnet-faucet:${chainId}:${toAddress}`;
  const accountCacheKey = `testnet-faucet:${chainId}:${account.data.id}`;

  // Assert 1 request per IP/chain every 24 hours.
  // get the cached value
  const [ipCacheValue, accountCacheValue, addressCacheValue] =
    await Promise.all([
      cacheGet(ipCacheKey),
      cacheGet(accountCacheKey),
      cacheGet(addressCacheKey),
    ]);

  // if we have a cached value, return an error
  if (
    ipCacheValue !== null ||
    accountCacheValue !== null ||
    addressCacheValue !== null
  ) {
    return NextResponse.json(
      { error: "Already requested funds on this chain in the past 24 hours." },
      { status: 429 },
    );
  }

  // Set an idempotencyKey to prevent duplicate claims for this chain/ip/time period.
  const todayLocal = startOfToday();
  const todayUTC = new Date(
    todayLocal.getTime() - todayLocal.getTimezoneOffset() * 60000,
  );
  const todayUTCSeconds = Math.floor(todayUTC.getTime() / 1000);
  const idempotencyKey = `${ipCacheKey}:${todayUTCSeconds}`;
  const amountToClaim = getFaucetClaimAmount(chainId).toString();

  try {
    // Store the claim request for 24 hours.
    await Promise.all([
      cacheSet(ipCacheKey, "claimed", 24 * 60 * 60),
      cacheSet(accountCacheKey, "claimed", 24 * 60 * 60),
      cacheSet(addressCacheKey, "claimed", 24 * 60 * 60),
    ]);
    // then actually transfer the funds
    const url = `${THIRDWEB_ENGINE_URL}/backend-wallet/${chainId}/transfer`;
    const response = await fetch(url, {
      body: JSON.stringify({
        amount: amountToClaim,
        currencyAddress: ZERO_ADDRESS,
        to: toAddress,
      }),
      headers: {
        Authorization: `Bearer ${THIRDWEB_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "x-backend-wallet-address": NEXT_PUBLIC_THIRDWEB_ENGINE_FAUCET_WALLET,
        "x-idempotency-key": idempotencyKey,
      },
      method: "POST",
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

  return NextResponse.json({ amount: amountToClaim }, { status: 200 });
};
