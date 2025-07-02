import { CodeServer } from "@/components/ui/code/code.server";
import { isProd } from "@/constants/env-utils";
import { ClientIDSection } from "../../components/ProjectFTUX/ClientIDSection";
import { WaitingForIntegrationCard } from "../../components/WaitingForIntegrationCard/WaitingForIntegrationCard";

export function RpcFTUX(props: { clientId: string }) {
  return (
    <WaitingForIntegrationCard
      codeTabs={[
        {
          code: (
            <CodeServer
              className="bg-background"
              code={jsCode(props.clientId)}
              lang="ts"
            />
          ),
          label: "JavaScript",
        },
        {
          code: (
            <CodeServer
              className="bg-background"
              code={pythonCode(props.clientId)}
              lang="python"
            />
          ),
          label: "Python",
        },
        {
          code: (
            <CodeServer
              className="bg-background"
              code={curlCode(props.clientId)}
              lang="bash"
            />
          ),
          label: "Curl",
        },
      ]}
      ctas={[
        {
          href: "https://portal.thirdweb.com/rpc-edge",
          label: "View Docs",
        },
      ]}
      title="Start Using RPC"
    >
      <ClientIDSection clientId={props.clientId} />
      <div className="h-4" />
    </WaitingForIntegrationCard>
  );
}

const twDomain = isProd ? "thirdweb" : "thirdweb-dev";

const jsCode = (clientId: string) => `\
// Example: Get latest block number on Ethereum
const res = await fetch("https://1.rpc.${twDomain}.com/${clientId}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1,
  }),
});
const data = await res.json();
console.log("Latest block number:", parseInt(data.result, 16));
`;

const curlCode = (clientId: string) => `\
# Example: Get latest block number on Ethereum
curl -X POST "https://1.rpc.${twDomain}.com/${clientId}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_blockNumber",
    "params": [],
    "id": 1
  }'
`;

const pythonCode = (clientId: string) => `\
# Example: Get latest block number on Ethereum
import requests
import json

response = requests.post(
    "https://1.rpc.${twDomain}.com/${clientId}",
    headers={"Content-Type": "application/json"},
    json={
        "jsonrpc": "2.0",
        "method": "eth_blockNumber",
        "params": [],
        "id": 1
    }
)
data = response.json()
print("Latest block number:", int(data["result"], 16))
`;
