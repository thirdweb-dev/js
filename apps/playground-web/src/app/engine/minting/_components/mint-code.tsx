import { Code } from "../../../../components/code/code";
import { mintExample } from "../constants";

export function MintCode() {
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
        Send Transaction Request to Mint NFTs
      </h3>
      <Code code={engineMintCode} lang="typescript" />

      <div className="h-8" />

      <div>
        <h3 className="mb-0.5 font-semibold text-xl tracking-tight">
          Get Transaction Status
        </h3>
        <p className="mb-3 text-muted-foreground">
          Once you send a request to mint NFTs, you can poll for the status of
          the transaction using the following code.
        </p>
      </div>
      <Code code={getEngineStatusCode} lang="typescript" />
    </div>
  );
}

const engineMintCode = `\
const chainId = ${mintExample.chainId};
const contractAddress = "${mintExample.contractAddress}";
const url = \`\${YOUR_ENGINE_URL}\/contract/\${chainId}/\${contractAddress}\/erc1155\/mint-to\`;

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_SECRET_TOKEN",
    "Content-Type": "application/json",
    "X-Backend-Wallet-Address": "YOUR_BACKEND_WALLET_ADDRESS",
  },
  body: JSON.stringify({
    receiver: "0x....",
    metadataWithSupply: {
      metadata: {
        name: "...",
        description: "...",
        image: "...", // ipfs or https link to your asset
      },
      supply: "1",
    },
  })
});

const data = await response.json();
console.log(data.queueId);
`;

const getEngineStatusCode = `\
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
