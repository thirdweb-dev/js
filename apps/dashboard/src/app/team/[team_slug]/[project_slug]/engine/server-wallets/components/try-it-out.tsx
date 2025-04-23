import { CodeServer } from "@/components/ui/code/code.server";
import { THIRDWEB_ENGINE_CLOUD_URL } from "@/constants/env";
import Link from "next/link";
import { Button } from "../../../../../../../@/components/ui/button";
import type { Wallet } from "../wallet-table/types";

export function TryItOut(props: {
  authToken: string;
  wallet?: Wallet;
  team_slug: string;
  project_slug: string;
}) {
  return (
    <div className="flex flex-col gap-6 overflow-hidden rounded-lg border border-border bg-card p-6">
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-1 flex-col gap-4 rounded-lg rounded-b-none lg:flex-row lg:justify-between">
          <div>
            <h2 className="font-semibold text-xl tracking-tight">
              Usage from your backend
            </h2>
            <p className="text-muted-foreground text-sm">
              Send transactions to the blockchain using a simple http API
            </p>
          </div>
        </div>
      </div>
      <div>
        <CodeServer
          lang="ts"
          code={sendTransactionExample()}
          className="bg-background"
        />
        <div className="h-4" />
        <div className="flex flex-row justify-end gap-4">
          <Button variant={"secondary"} asChild>
            <Link
              href={`/team/${props.team_slug}/${props.project_slug}/engine/explorer`}
              rel="noreferrer"
            >
              View API reference
            </Link>
          </Button>
          {props.wallet && (
            <Button variant={"primary"} asChild>
              <Link
                href={`/team/${props.team_slug}/${props.project_slug}/engine?expand_test_tx=true`}
                rel="noreferrer"
              >
                Send a test transaction
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const sendTransactionExample = () => `\
const response = fetch(
    "${THIRDWEB_ENGINE_CLOUD_URL}/write/contract",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-secret-key": "<your-project-secret-key>",
        },
        body: JSON.stringify({
            "executionOptions": {
                "type": "AA",
                "signerAddress": "<your-server-wallet-address>"
            },
            "transactionParams": [
              {
                "contractAddress": "0x...",
                "method": "approve",
                "params": ["0x...", "0"],
              },
            ],
            "vaultAccessToken": "<your-wallet-access-token>",
            "chainId": "84532"
        }),
    }
);`;
