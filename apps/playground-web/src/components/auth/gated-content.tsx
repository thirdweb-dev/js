import { cookies } from "next/headers";
import Link from "next/link";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { balanceOf } from "thirdweb/extensions/erc20";
import { getAuthResult } from "@/app/connect/auth/server/actions/auth";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { AuthButton } from "./auth-button";

export async function GatedContentPreview() {
  const jwt = (await cookies()).get("jwt");
  const authResult = jwt?.value ? await getAuthResult(jwt.value) : undefined;
  if (!authResult) {
    return (
      <div className="flex flex-col gap-5">
        <div className="mx-auto">
          <AuthButton />
        </div>
        <div className="text-center">Log in to see the secret content</div>
      </div>
    );
  }

  // If the user has logged in, get their wallet address
  const address = authResult.parsedJWT.sub;
  if (!address) throw new Error("could not get wallet address");

  // This is the part that we do the gating condition.
  // If pass -> Allow them to access the page.
  async function hasEnoughBalance(userAddress: string) {
    const erc20Contract = getContract({
      address: "0xACf072b740a23D48ECd302C9052fbeb3813b60a6",
      chain: sepolia,
      client: THIRDWEB_CLIENT,
    });

    const requiredQuantity = 10n; // 10 erc20 token

    const ownedBalance = await balanceOf({
      address: userAddress,
      contract: erc20Contract,
    });

    return ownedBalance < requiredQuantity;
  }

  // For this example, we check if a user has more than 10 $TWCOIN
  if (await hasEnoughBalance(authResult.parsedJWT.sub)) {
    return (
      <div className="flex flex-col gap-5">
        <div className="mx-auto">
          <AuthButton />
        </div>
        <div className="mx-auto px-3 text-center lg:max-w-[450px]">
          You are logged in. However you cannot see the secret content because
          you own less than 10 $TWCOIN.
          <br />
          Mint some tokens{" "}
          <Link
            className="font-bold text-yellow-400"
            href="/connect/blockchain-api"
          >
            here
          </Link>
        </div>
      </div>
    );
  }

  // Finally! We can load the gated content for them now

  return (
    <div className="flex flex-col gap-5">
      <div className="mx-auto">
        <AuthButton />
      </div>
      <div className="text-center font-bold text-green-600 text-lg">
        Congratulations!
      </div>
      <div className="mx-auto px-3 text-center">
        You can see this message because you own more than 10 TWCOIN.
        <br />
        Mint a free commemorative NFT{" "}
        <a
          className="font-bold text-yellow-400 underline"
          href="https://thirdweb.com/arbitrum/0xE7d6D628163de95D1c72c343ee852539B51f35Dc/nfts/0?utm_source=playground"
          rel="noreferrer"
          target="_blank"
        >
          here
        </a>
      </div>
    </div>
  );
}
