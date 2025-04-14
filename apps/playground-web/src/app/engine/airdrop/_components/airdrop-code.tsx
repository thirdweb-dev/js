import { Code } from "../../../../components/code/code";
import { airdropExample } from "../constants";

export function AirdropCode() {
  return (
    <div className="">
      <div>
        <h2 className="mb-0.5 font-semibold text-2xl tracking-tight">Code</h2>
        <p className="text-muted-foreground">
          Code to implement above shown example
        </p>
      </div>

      <div className="h-4" />
      <h3 className="mb-2 font-semibold text-xl tracking-tight">
        Send Airdrop Transaction Request
      </h3>
      <Code code={engineAirdropSendCode} lang="typescript" />

      <div className="h-8" />

      <div>
        <h3 className="mb-0.5 font-semibold text-xl tracking-tight">
          Get Transaction Status
        </h3>
        <p className="mb-3 text-muted-foreground">
          Once you send a request to airdrop tokens, you can poll for the status
          of the transaction using the following code.
        </p>
      </div>
      <Code code={engineAirdropGetStatus} lang="typescript" />
    </div>
  );
}

const engineAirdropSendCode = `\
const chainId = ${airdropExample.chainId};
const contractAddress = "${airdropExample.contractAddress}";
const addresses = ${JSON.stringify(
  airdropExample.receivers.map((x) => ({
    address: x.toAddress,
    quantity: x.amount,
  })),
  null,
  2,
)};

const url = \`\${YOUR_ENGINE_URL}\/contract/\${chainId}/\${contractAddress}\/erc1155\/airdrop\`;

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_SECRET_TOKEN",
    "Content-Type": "application/json",
    "X-Backend-Wallet-Address": "YOUR_BACKEND_WALLET_ADDRESS",
  },
  body: JSON.stringify({ addresses }),
});

const data = await response.json();
const queueId = data.queueId;
`;

const engineAirdropGetStatus = `\
function getEngineTxStatus(queueId: string) {
  const url = \`\${YOUR_ENGINE_URL}\/transaction/\${queueId}\`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": "Bearer YOUR_SECRET_TOKEN",
    },
  });

  const data = await response.json();
  return data.result;
}

// you can keep polling for the status until you get a status of either "mined" or "errored" or "cancelled"
const result = await getEngineTxStatus(queueId);

console.log(result.status);
`;
