"use client";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { addSessionKey } from "thirdweb/extensions/erc4337";
import { PayEmbed } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
import { smartWallet } from "thirdweb/wallets";
import { createAndSignUserOp } from "thirdweb/wallets/smart";

export function StyledPayEmbedPreview() {
  const { theme } = useTheme();
  const account = useActiveAccount();
  console.log("account", account);
  const smartWalletInit = async () => {
    if (!account) return;
    const chain = sepolia;
    const client = THIRDWEB_CLIENT;

    const smartWalletHandle = smartWallet({
      chain,
      sponsorGas: true,
    });

    const smartAccount = await smartWalletHandle.connect({
      client,
      personalAccount: account,
    });
    console.log("smartAccount", smartAccount);

    const smartAccountContract = getContract({
      client,
      chain,
      address: smartAccount.address,
    });

    const sessionKeyTx = addSessionKey({
      contract: smartAccountContract,
      account: account,
      // // prod
      // sessionKeyAddress: "0x1629Ce9Df01B10E7CF8837f559037A49d983aA10", // pay engine backend wallet
      // dev
      sessionKeyAddress: "0x32DC86f866e9F5Ed59A60b18c3B0f9b972a928F0",
      permissions: {
        approvedTargets: "*", // the addresses of allowed contracts, or '*' for any contract
        permissionStartTimestamp: new Date(), // the date when the session key becomes active
        permissionEndTimestamp: new Date(Date.now() + 24 * 60 * 60 * 1000), // the date when the session key expires
      },
    });

    // const bundle = bundleUserOp({
    //   userOperation: sessionKeyTx,
    //   factoryContract: smartAccountContract,
    //   accountContract: smartAccountContract,
    //   adminAddress: account.address,
    //   sponsorGas: true,
    // });
    const { signedUserOp, hexlifiedUserOp } = await createAndSignUserOp({
      transaction: sessionKeyTx,
      adminAccount: account,
      client,
      smartWalletOptions: {
        chain,
        sponsorGas: true,
      },
    });
    console.log("signedUserOp", signedUserOp);
    console.log("hexlifiedUserOp", hexlifiedUserOp);
    console.log("sessionKeyTx", sessionKeyTx);

    const response = await fetch(
      "http://localhost:3008/v2/intent-wallets/deploy",
      {
        method: "POST",
        body: JSON.stringify({
          chainId: sepolia.id,
          signedUserOps: [hexlifiedUserOp],
        }),
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
        },
      },
    );

    const data = await response.json();
    console.log("response from server", data);

    // const tx = await sendTransaction({
    //   transaction: sessionKeyTx,
    //   account: account,
    // });
    // console.log(tx);
  };

  return (
    <>
      <button onClick={smartWalletInit} type="button">
        test smart wallet init
      </button>

      <PayEmbed
        client={THIRDWEB_CLIENT}
        payOptions={{
          buyWithFiat: {
            preferredProvider: "STRIPE",
          },
        }}
        theme={theme === "light" ? "light" : "dark"}
      />
    </>
  );
}
