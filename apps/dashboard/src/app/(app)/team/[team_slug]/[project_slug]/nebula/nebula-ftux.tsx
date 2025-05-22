import { CodeServer } from "@/components/ui/code/code.server";
import { SecretKeySection } from "../components/ProjectFTUX/SecretKeySection";
import { WaitingForIntegrationCard } from "../components/WaitingForIntegrationCard/WaitingForIntegrationCard";

export function NebulaFTUX(props: {
  secretKeyMasked: string;
  teamId: string;
  projectId: string;
}) {
  return (
    <WaitingForIntegrationCard
      title="Integrate Nebula"
      codeTabs={[
        {
          label: "JavaScript",
          code: (
            <CodeServer code={jsCode} className="bg-background" lang="ts" />
          ),
        },
        {
          label: "Python",
          code: (
            <CodeServer
              code={pythonCode}
              className="bg-background"
              lang="python"
            />
          ),
        },
        {
          label: "Curl",
          code: (
            <CodeServer code={curlCode} className="bg-background" lang="bash" />
          ),
        },
      ]}
      ctas={[
        {
          label: "Try on Playground",
          href: "https://nebula.thirdweb.com/",
          trackingLabel: "playground",
          category: "nebula-ftux",
        },
        {
          label: "View Docs",
          href: "https://portal.thirdweb.com/nebula",
          trackingLabel: "docs",
          category: "nebula-ftux",
        },
      ]}
    >
      <SecretKeySection
        secretKeyMasked={props.secretKeyMasked}
        teamId={props.teamId}
        projectId={props.projectId}
      />
      <div className="h-4" />
    </WaitingForIntegrationCard>
  );
}

const jsCode = `\
// Example: Send message to Nebula
// Replace PROJECT_SECRET_KEY with your project's full secret key

const res = await fetch("https://nebula-api.thirdweb.com/chat", {
  method: "POST",
  headers: {
    "x-secret-key": "PROJECT_SECRET_KEY",
  },
  body: {
    message: "Hello",
    stream: false,
  },
});

const data = await res.json();
`;

const curlCode = `\
# Example: Send message to Nebula
# Replace PROJECT_SECRET_KEY with your project's full secret key

curl -X POST https://nebula-api.thirdweb.com/chat \
-H "x-secret-key:PROJECT_SECRET_KEY" \
-d '{
  "message": "Hello",
  "stream": false,
}'
`;

const pythonCode = `\
# Example: Send message to Nebula
# Replace PROJECT_SECRET_KEY with your project's full secret key

import requests

response = requests.post("https://nebula-api.thirdweb.com/chat", headers={
  "x-secret-key": "PROJECT_SECRET_KEY"
}, json={
  "message": "Hello",
  "stream": False,
})

data = response.json()
`;
