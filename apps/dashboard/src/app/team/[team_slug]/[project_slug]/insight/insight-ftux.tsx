import { CodeServer } from "@/components/ui/code/code.server";
import { isProd } from "@/constants/env";
import { WaitingForIntegrationCard } from "../components/WaitingForIntegrationCard/WaitingForIntegrationCard";

export function InsightFTUX(props: {
  clientId: string;
}) {
  return (
    <WaitingForIntegrationCard
      title="Integrate Insight"
      clientId={props.clientId}
      codeTabs={[
        {
          label: "JavaScript",
          code: (
            <CodeServer
              code={jsCode(props.clientId)}
              className="bg-background"
              lang="ts"
            />
          ),
        },
        {
          label: "Python",
          code: (
            <CodeServer
              code={pythonCode(props.clientId)}
              className="bg-background"
              lang="python"
            />
          ),
        },
        {
          label: "Curl",
          code: (
            <CodeServer
              code={curlCode(props.clientId)}
              className="bg-background"
              lang="bash"
            />
          ),
        },
      ]}
      ctas={[
        {
          label: "Try on Playground",
          href: "https://playground.thirdweb.com/insight",
          trackingLabel: "playground",
        },
        {
          label: "View Docs",
          href: "https://portal.thirdweb.com/insight",
          trackingLabel: "docs",
        },
      ]}
    />
  );
}

const twDomain = isProd ? "thirdweb" : "thirdweb-dev";

const jsCode = (clientId: string) => `\
// Example: Get latest 10 transactions on Ethereum
const res = await fetch("https://insight.${twDomain}.com/v1/transactions?chain=1&limit=10&clientId=${clientId}");
const data = await res.json();
`;

const curlCode = (clientId: string) => `\
# Example: Get latest 10 transactions on Ethereum
curl -X GET "https://insight.${twDomain}.com/v1/transactions?chain=1&limit=10&clientId=${clientId}"
`;

const pythonCode = (clientId: string) => `\
# Example: Get latest 10 transactions on Ethereum
import requests

response = requests.get("https://insight.${twDomain}.com/v1/transactions?chain=1&limit=10&clientId=${clientId}")
data = response.json()
`;
