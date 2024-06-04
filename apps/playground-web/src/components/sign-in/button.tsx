import { CodeExample } from "../code/code-example";
import { StyledConnectButton } from "../styled-connect-button";

export function ButtonComponent() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Button Component
        </h2>
        <p className="max-w-[600px]">
          When clicked opens a modal and allows users to connect to various
          wallets.
          <br />
          Extremely customizable and easy to use.
        </p>
      </div>

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
    </>
  );
}
