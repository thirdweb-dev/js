import { Button } from "@/components/ui/button";
import { CodeServer } from "../../../../../../../@/components/ui/code/code.server";
import { THIRDWEB_ENGINE_CLOUD_URL } from "../../../../../../../@/constants/env";

export function TryItOut() {
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
        <Button variant={"secondary"}>View API reference</Button>
      </div>
      <div>
        <CodeServer
          lang="ts"
          code={typescriptCodeExample()}
          className="bg-background"
        />
      </div>
    </div>
  );
}

const typescriptCodeExample = () => `\
const response = fetch(
    "${THIRDWEB_ENGINE_CLOUD_URL}/account/send-transaction", 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-secret-key": <your-project-secret-key>,
        },
        body: JSON.stringify({
            "executionOptions": {
                "type": "AA",
                "signerAddress": <your-server-wallet-address>
            },
            "transactionParams": [
            {
                "to": "0xeb0effdfb4dc5b3d5d3ac6ce29f3ed213e95d675",
                "value": "0"
            }
            ],
            "vaultAccessToken": <your-wallet-access-token>,
            "chainId": "84532"
        }),
    }
);`;
