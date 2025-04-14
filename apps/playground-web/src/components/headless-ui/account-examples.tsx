import { CodeExample } from "../code/code-example";
import {
  AccountAvatarBasicPreview,
  AccountBalanceBasicPreview,
  AccountBalanceCustomTokenPreview,
  AccountBalanceFormatPreview,
  AccountBalanceUSDPreview,
  AccountBlobbieBasicPreview,
  AccountNameBasicPreview,
  AccountNameCustomPreview,
} from "./account-previews";

export function AccountNameExample() {
  return (
    <div>
      <CodeExample
        header={{
          title: "AccountName",
          description: "Show the social alias associated with the account.",
        }}
        preview={<AccountNameBasicPreview />}
        code={`import { AccountProvider, AccountName } from "thirdweb/react";

function App() {
  return <AccountProvider address="0xd8da6bf26964af9d7eed9e03e53415d37aa96045" client={thirdwebClient}>
    <AccountName loadingComponent={<span>Loading...</span>} />
  </AccountProvider>
}`}
        lang="tsx"
      />

      <p className="my-4 text-muted-foreground">
        Show account name for a specific social network
      </p>

      <CodeExample
        preview={<AccountNameCustomPreview />}
        code={`import { AccountProvider, AccountName } from "thirdweb/react";

function App() {
  return <AccountProvider address="0xd8da6bf26964af9d7eed9e03e53415d37aa96045" client={thirdwebClient}>
    {/* You can choose between "ens", "lens" and "farcaster" */}
    <AccountName socialType="lens" loadingComponent={<span>Loading...</span>} />
  </AccountProvider>
}`}
        lang="tsx"
      />
    </div>
  );
}

export function AccountBalanceExample() {
  return (
    <div>
      <CodeExample
        header={{
          title: "AccountBalance",
          description: "Display the current native balance of the wallet.",
        }}
        preview={<AccountBalanceBasicPreview />}
        code={`import { AccountProvider, AccountAddress } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";

function App() {
  return <AccountProvider address="0xd8da6bf26964af9d7eed9e03e53415d37aa96045" client={thirdwebClient}>
    <AccountBalance
      chain={ethereum}
      loadingComponent={<span>Loading...</span>}
    />
  </AccountProvider>
}`}
        lang="tsx"
      />

      <p className="my-4 text-muted-foreground">
        Display the balance of a custom token
      </p>

      <CodeExample
        preview={<AccountBalanceCustomTokenPreview />}
        code={`import { AccountProvider, AccountAddress } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";

const USDC_ETHEREUM = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

function App() {
  return <AccountProvider address="0xd8da6bf26964af9d7eed9e03e53415d37aa96045" client={thirdwebClient}>
    <AccountBalance
      chain={ethereum}
      tokenAddress={USDC_ETHEREUM}
      loadingComponent={<span>Loading...</span>}
    />
  </AccountProvider>
}`}
        lang="tsx"
      />

      <p className="my-4 text-muted-foreground">
        Round up the wallet balance using the <b>formatFn</b> prop.
      </p>

      <CodeExample
        preview={<AccountBalanceFormatPreview />}
        code={`import { AccountProvider, AccountAddress, type AccountBalanceFormatParams } from "thirdweb/react";

function App() {
  return <AccountProvider address="0xd8da6bf26964af9d7eed9e03e53415d37aa96045" client={thirdwebClient}>
    <AccountBalance
      chain={ethereum}
      loadingComponent={<span>Loading...</span>}
      formatFn={(props: AccountBalanceInfo) => \`\${Math.ceil(props.balance * 1000) / 1000} \${props.symbol}\`} />
  </AccountProvider>
}`}
        lang="tsx"
      />

      <p className="my-4 text-muted-foreground">
        Show the balance in USD using the <b>showBalanceInFiat</b> prop.
      </p>

      <CodeExample
        preview={<AccountBalanceUSDPreview />}
        code={`import { AccountProvider, AccountAddress } from "thirdweb/react";

function App() {
  return (
    <AccountProvider address="0xd8da6bf26964af9d7eed9e03e53415d37aa96045" client={thirdwebClient}>
      <AccountBalance
        chain={ethereum}
        showBalanceInFiat="USD"
        loadingComponent={<span>Loading...</span>}
      />
    </AccountProvider>
  )
}`}
        lang="tsx"
      />
    </div>
  );
}

export function AccountAvatarExample() {
  return (
    <CodeExample
      header={{
        title: "AccountAvatar",
        description: "Show the social avatar associated with the account",
      }}
      preview={<AccountAvatarBasicPreview />}
      code={`import { AccountProvider, AccountAvatar } from "thirdweb/react";

function App() {
  return <AccountProvider address="0xd8da6bf26964af9d7eed9e03e53415d37aa96045" client={thirdwebClient}>
    <AccountAvatar className="w-20 h-20 rounded-full" loadingComponent={<span>Loading...</span>} />
  </AccountProvider>
}`}
      lang="tsx"
    />
  );
}

export function AccountBlobbieExample() {
  return (
    <CodeExample
      header={{
        title: "AccountBlobbie",
        description:
          "Show the unique blobbie generated from the wallet address",
      }}
      preview={<AccountBlobbieBasicPreview />}
      code={`import { AccountProvider, AccountBlobbie } from "thirdweb/react";

function App() {
  return <AccountProvider address="0xd8da6bf26964af9d7eed9e03e53415d37aa96045" client={thirdwebClient}>
    <AccountBlobbie className="h-20 w-20 rounded-full" />
  </AccountProvider>
}`}
      lang="tsx"
    />
  );
}
