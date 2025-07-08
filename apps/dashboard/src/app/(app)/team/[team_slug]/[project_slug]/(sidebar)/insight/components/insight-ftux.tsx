import { CodeServer } from "@/components/ui/code/code.server";
import { isProd } from "@/constants/env-utils";
import { ClientIDSection } from "../../components/ProjectFTUX/ClientIDSection";
import { WaitingForIntegrationCard } from "../../components/WaitingForIntegrationCard/WaitingForIntegrationCard";

export function InsightFTUX(props: { clientId: string }) {
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
          href: "https://playground.thirdweb.com/insight",
          label: "Try on Playground",
        },
        {
          href: "https://portal.thirdweb.com/insight",
          label: "View Docs",
        },
      ]}
      title="Integrate Insight"
    >
      <ClientIDSection clientId={props.clientId} />
      <div className="h-4" />
    </WaitingForIntegrationCard>
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
