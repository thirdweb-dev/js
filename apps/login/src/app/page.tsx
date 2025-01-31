"use client";

import { useSearchParams } from "next/navigation";
import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { addSessionKey, isActiveSigner } from "thirdweb/extensions/erc4337";
import {
  ConnectEmbed,
  TransactionButton,
  useActiveAccount,
} from "thirdweb/react";
import { isContractDeployed } from "thirdweb/utils";

const sesionKeySignerAddress = "0x6f700ba0258886411D2536399624EAa7158d1742";

const client = createThirdwebClient({
  clientId: "e9ba48c289e0cc3d06a23bfd370cc111",
});

export default function Page() {
  const account = useActiveAccount();

  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const clientId = searchParams.get("clientId");
  const redirect = searchParams.get("redirect");

  console.log({ code, clientId, redirect });

  return (
    <div className="grid h-full w-full place-items-center">
      {account ? (
        <div className="flex flex-col gap-4 rounded-lg border border-gray-800 p-12">
          <h1 className="font-bold text-3xl">Grant Permissions</h1>
          <p>
            <strong>App.xyz</strong> is asking you to grant it the following
            permissions:
          </p>
          <ul>
            <li>✅ Receive your identity information.</li>
            <li>
              ✅ Interact with <strong>all</strong> contracts on{" "}
              <strong>Base Sepolia</strong>
            </li>
            <li>
              ✅ Spend <strong>all</strong> your funds on{" "}
              <strong>Base Sepolia</strong>
            </li>
          </ul>
          <p>
            By approving below you will grant <strong>App.xyz</strong> these
            permissions until <strong>02/02/2025</strong>.
          </p>
          <TransactionButton
            transaction={async () => {
              if (!account) {
                throw new Error("No account found");
              }
              const accountContract = getContract({
                address: account.address,
                // hard coded for now
                chain: baseSepolia,
                client,
              });
              let hasSesionKey = false;
              // check if already added
              const accountDeployed = await isContractDeployed(accountContract);
              if (accountDeployed) {
                hasSesionKey = await isActiveSigner({
                  contract: accountContract,
                  signer: sesionKeySignerAddress,
                });
              }
              // if not added, send tx to add the session key
              if (!hasSesionKey) {
                return addSessionKey({
                  account,
                  contract: accountContract,
                  sessionKeyAddress: sesionKeySignerAddress,
                  // hard coded for now
                  permissions: { approvedTargets: "*" },
                });
              }
              throw "already-added";
            }}
            onError={(e) => {
              if (typeof e === "string" && e === "already-added") {
                // redirect back to the app
                window.location.href = `${redirect}${encodeHash(
                  account.address,
                  sesionKeySignerAddress,
                  code || "",
                )}`;
              } else {
                console.error(e);
              }
            }}
            onTransactionConfirmed={() => {
              // redirect back to the app
              window.location.href = `${redirect}${encodeHash(
                account.address,
                sesionKeySignerAddress,
                code || "",
              )}`;
            }}
          >
            Approve
          </TransactionButton>
        </div>
      ) : (
        <ConnectEmbed
          client={client}
          accountAbstraction={{ chain: baseSepolia, sponsorGas: true }}
        />
      )}
    </div>
  );
}

function encodeHash(
  userAddress: string,
  sessionKeyAddress: string,
  code: string,
) {
  // Create an object with the three keys.
  const data = { userAddress, sessionKeyAddress, code };

  // Convert to JSON and then Base64-encode the result.
  const jsonString = JSON.stringify(data);
  const base64Data = btoa(jsonString);

  // Return as a hash string (with the "#" prefix).
  return `#${base64Data}`;
}
