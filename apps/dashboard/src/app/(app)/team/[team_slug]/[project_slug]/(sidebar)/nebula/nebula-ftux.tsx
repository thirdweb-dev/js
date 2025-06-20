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
      codeTabs={[
        {
          code: (
            <CodeServer className="bg-background" code={jsCode} lang="ts" />
          ),
          label: "JavaScript",
        },
        {
          code: (
            <CodeServer
              className="bg-background"
              code={pythonCode}
              lang="python"
            />
          ),
          label: "Python",
        },
        {
          code: (
            <CodeServer className="bg-background" code={curlCode} lang="bash" />
          ),
          label: "Curl",
        },
      ]}
      ctas={[
        {
          href: "https://nebula.thirdweb.com/",
          label: "Try on Playground",
        },
        {
          href: "https://portal.thirdweb.com/nebula",
          label: "View Docs",
        },
      ]}
      title="Integrate Nebula"
    >
      <SecretKeySection
        projectId={props.projectId}
        secretKeyMasked={props.secretKeyMasked}
        teamId={props.teamId}
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
