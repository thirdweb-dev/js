import { CodeExample } from "@/components/code/code-example";
import { StyledConnectButton } from "@/components/styled-connect-button";
import React from "react";

export function ConnectButtonExample() {
  return (
    <CodeExample
      preview={<StyledConnectButton />}
      code={`import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";

const THIRDWEB_CLIENT = createThirdwebClient({
  clientId: "<YOUR_CLIENT_ID>"
});

function App(){
  return (
    <ConnectButton client={THIRDWEB_CLIENT} />
  );
};`}
      lang="tsx"
    />
  );
}
