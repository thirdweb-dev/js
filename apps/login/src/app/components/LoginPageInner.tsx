"use client";

import { useSearchParams } from "next/navigation";
import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { addSessionKey, isActiveSigner } from "thirdweb/extensions/erc4337";
import {
  AccountAddress,
  AccountBlobbie,
  AccountProvider,
  ConnectEmbed,
  TransactionButton,
  useActiveAccount,
} from "thirdweb/react";
import { isContractDeployed, shortenAddress } from "thirdweb/utils";

const sessionKeySignerAddress = "0x6f700ba0258886411D2536399624EAa7158d1742";

export function LoginPageInner({
  generateJWT,
}: {
  generateJWT: (opts: {
    address: string;
    sessionKeySignerAddress: string;
    code: string;
  }) => Promise<string>;
}) {
  const account = useActiveAccount();

  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  // const clientId = searchParams.get("clientId");
  const redirect = searchParams.get("redirect");

  const client = createThirdwebClient({
    clientId: "e9ba48c289e0cc3d06a23bfd370cc111",
  });
  return (
    <div className="grid h-full w-full place-items-center">
      {account ? (
        <div
          className="flex flex-col gap-4 rounded-lg border p-12"
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <AccountProvider address={account.address} client={client}>
            <div
              className="flex flex-row items-center gap-2 rounded-md border p-4"
              style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <AccountBlobbie className="h-12 w-12 rounded-full" />
              <div className="flex flex-col gap-0">
                <AccountAddress formatFn={shortenAddress} />
              </div>
            </div>
          </AccountProvider>
          <hr className="opacity-10" />
          <div className="flex flex-col gap-0">
            <h1 className="font-bold text-2xl">Grant Permissions</h1>
            <p className="opacity-70">
              <strong>App.xyz</strong> is asking you to grant it the following
              permissions:
            </p>
          </div>
          <hr className="opacity-10" />
          <ul>
            <li>
              <span className="mr-4">✅</span>Read your wallet address.
            </li>
          </ul>
          <hr className="opacity-10" />
          <ul>
            <li>
              <span className="mr-4">⚠️</span>Interact with <strong>all</strong>{" "}
              contracts on <strong>Base Sepolia</strong>
            </li>
            <li>
              <span className="mr-4">⚠️</span>Spend <strong>all</strong> your
              funds on <strong>Base Sepolia</strong>
            </li>
            <li>
              <span className="mr-4">📆</span>Granted until{" "}
              <strong>02/02/2025</strong>
            </li>
          </ul>
          <hr className="opacity-10" />
          <div className="flex flex-row gap-4">
            <button
              type="button"
              className="w-[50%] rounded-lg border p-2 hover:bg-gray-950"
              style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
              onClick={() => {
                window.location.href = redirect || "";
              }}
            >
              Deny
            </button>
            <TransactionButton
              className="!w-[50%]"
              transaction={async () => {
                if (!account) {
                  throw new Error("No account found");
                }
                if (!code) {
                  throw new Error("No code found");
                }
                if (!redirect) {
                  throw new Error("No redirect found");
                }
                const accountContract = getContract({
                  address: account.address,
                  // hard coded for now
                  chain: baseSepolia,
                  client,
                });
                let hasSessionKey = false;
                // check if already added
                const accountDeployed =
                  await isContractDeployed(accountContract);
                if (accountDeployed) {
                  hasSessionKey = await isActiveSigner({
                    contract: accountContract,
                    signer: sessionKeySignerAddress,
                  });
                }
                // if not added, send tx to add the session key
                if (!hasSessionKey) {
                  return addSessionKey({
                    account,
                    contract: accountContract,
                    sessionKeyAddress: sessionKeySignerAddress,
                    // hard coded for now
                    permissions: { approvedTargets: "*" },
                  });
                }
                throw "already-added";
              }}
              onError={async (e) => {
                if (!code) {
                  throw new Error("No code found");
                }
                if (!redirect) {
                  throw new Error("No redirect found");
                }
                if (typeof e === "string" && e === "already-added") {
                  // sign jwt
                  const jwt = await generateJWT({
                    address: account.address,
                    sessionKeySignerAddress,
                    code,
                  });
                  // redirect
                  window.location.href = `${redirect}?code=${code}#${jwt}`;
                } else {
                  console.error(e);
                }
              }}
              onTransactionConfirmed={async () => {
                if (!code) {
                  throw new Error("No code found");
                }
                if (!redirect) {
                  throw new Error("No redirect found");
                }
                // sign jwt
                const jwt = await generateJWT({
                  address: account.address,
                  sessionKeySignerAddress,
                  code,
                });
                // redirect
                window.location.href = `${redirect}?code=${code}#${jwt}`;
              }}
            >
              Approve
            </TransactionButton>
          </div>
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
