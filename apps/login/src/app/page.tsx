"use client";

import { useSearchParams } from "next/navigation";
import { createThirdwebClient, getContract, sendTransaction } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { addSessionKey, isActiveSigner } from "thirdweb/extensions/erc4337";
import { ConnectEmbed, useActiveAccount } from "thirdweb/react";
import { isContractDeployed } from "thirdweb/utils";

const sesionKeySignerAddress = "0x6f700ba0258886411D2536399624EAa7158d1742";

const client = createThirdwebClient({
  clientId: "e9ba48c289e0cc3d06a23bfd370cc111",
});

export default function Page() {
  const account = useActiveAccount();

  const onAccept = async () => {
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
      const transaction = addSessionKey({
        account,
        contract: accountContract,
        sessionKeyAddress: sesionKeySignerAddress,
        // hard coded for now
        permissions: { approvedTargets: "*" },
      });
      await sendTransaction({
        account,
        transaction,
      });
    }
  };

  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const clientId = searchParams.get("clientId");
  const redirect = searchParams.get("redirect");

  console.log({ code, clientId, redirect });

  return (
    <div className="grid h-full w-full place-items-center">
      {account ? (
        <div>
          <h1>Permissions Screen</h1>
          <ul>
            <li>perm 1</li>
            <li>perm 2</li>
            <li>perm 3</li>
          </ul>
          <button
            type="button"
            onClick={() => {
              onAccept()
                .then(() => {
                  // redirect back to the app
                  window.location.href = `${redirect}${encodeHash(
                    account.address,
                    sesionKeySignerAddress,
                    code || "",
                  )}`;
                })
                .catch((e) => {
                  console.error("failed", e);
                });
            }}
          >
            Accept
          </button>
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
