import { CodeExample } from "../code/code-example";
import { StyledConnectEmbed } from "../styled-connect-embed";

export function EmbedComponent() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Embed Component
        </h2>
        <p className="max-w-[600px]">
          Inline component to connect to various wallets.
          <br />
          Use this to create your own full screen login page.
        </p>
      </div>

      <CodeExample
        preview={<StyledConnectEmbed />}
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
    </>
  );
}
