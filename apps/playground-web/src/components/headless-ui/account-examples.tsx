import { CodeExample } from "../code/code-example";
import {
  AccountAddressBasicPreview,
  AccountAddressFormatPreview,
  AccountAvatarBasicPreview,
  AccountBalanceBasicPreview,
  AccountBalanceCustomTokenPreview,
  AccountBalanceFormatPreview,
  AccountBalanceUSDPreview,
  AccountBlobbieBasicPreview,
  AccountNameBasicPreview,
  AccountNameCustomPreview,
  ConnectDetailsButtonClonePreview,
} from "./account-previews";

/**
 * Show full wallet address with AccountAddress
 */
export function AccountAddressBasic() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          AccountAddress
        </h2>
        <p className="max-w-[600px] text-lg">
          Show the wallet address of the account.
        </p>
      </div>

      <CodeExample
        preview={<AccountAddressBasicPreview />}
        code={`import { AccountProvider, AccountAddress } from "thirdweb/react";

function App() {
  return <AccountProvider address="0xd8da6bf26964af9d7eed9e03e53415d37aa96045" client={thirdwebClient}>
    <AccountAddress />
  </AccountProvider>
}`}
        lang="tsx"
      />
    </>
  );
}

/**
 * Shorten wallet address with AccountAddress
 */
export function AccountAddressFormat() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <p className="max-w-[600px] text-lg">
          Shorten the wallet address using the <b>formatFn</b> prop.
        </p>
      </div>

      <CodeExample
        preview={<AccountAddressFormatPreview />}
        code={`import { AccountProvider, AccountAddress } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";

function App() {
  return <AccountProvider address="0xd8da6bf26964af9d7eed9e03e53415d37aa96045" client={thirdwebClient}>
    <AccountAddress formatFn={shortenAddress} />
  </AccountProvider>
}`}
        lang="tsx"
      />
    </>
  );
}

/**
 * Show the social name of an account
 */
export function AccountNameBasic() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          AccountName
        </h2>
        <p className="max-w-[600px] text-lg">
          Show the social alias associated with the account
        </p>
      </div>

      <CodeExample
        preview={<AccountNameBasicPreview />}
        code={`import { AccountProvider, AccountName } from "thirdweb/react";

function App() {
  return <AccountProvider address="0xd8da6bf26964af9d7eed9e03e53415d37aa96045" client={thirdwebClient}>
    <AccountName loadingComponent={<span>Loading...</span>} />
  </AccountProvider>
}`}
        lang="tsx"
      />
    </>
  );
}

export function AccountNameCustom() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <p className="max-w-[600px] text-lg">
          Show account name for a specific social network
        </p>
      </div>

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
    </>
  );
}

/**
 * AccountBalance: Fetch native balance on Ethereum mainnet
 */
export function AccountBalanceBasic() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          AccountBalance
        </h2>
        <p className="max-w-[600px] text-lg">
          Display the current native balance of the wallet.
        </p>
      </div>

      <CodeExample
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
    </>
  );
}

/**
 * AccountBalance: Fetch USDC balance on mainnet
 */
export function AccountBalanceCustomToken() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <p className="max-w-[600px] text-lg">
          Display the current balance of a custom token
        </p>
      </div>

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
    </>
  );
}

/**
 * AccountBalance: Round up the token balance
 */
export function AccountBalanceFormat() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <p className="max-w-[600px] text-lg">
          Round up the wallet balance using the <b>formatFn</b> prop.
        </p>
      </div>

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
    </>
  );
}

/**
 * AccountBalance: Show USD balance
 */
export function AccountBalanceUSD() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <p className="max-w-[600px] text-lg">
          Display the USD value of the token balance.
        </p>
      </div>

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
    </>
  );
}

/**
 * Show the social name of an account
 */
export function AccountAvatarBasic() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          AccountAvatar
        </h2>
        <p className="max-w-[600px] text-lg">
          Show the social avatar associated with the account
        </p>
      </div>

      <CodeExample
        preview={<AccountAvatarBasicPreview />}
        code={`import { AccountProvider, AccountAvatar } from "thirdweb/react";

function App() {
  return <AccountProvider address="0xd8da6bf26964af9d7eed9e03e53415d37aa96045" client={thirdwebClient}>
    <AccountAvatar className="w-20 h-20 rounded-full" loadingComponent={<span>Loading...</span>} />
  </AccountProvider>
}`}
        lang="tsx"
      />
    </>
  );
}

export function AccountBlobbieBasic() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          AccountBlobbie
        </h2>
        <p className="max-w-[600px] text-lg">
          Show the unique blobbie generated from the wallet address
        </p>
      </div>

      <CodeExample
        preview={<AccountBlobbieBasicPreview />}
        code={`import { AccountProvider, AccountBlobbie } from "thirdweb/react";

function App() {
  return <AccountProvider address="0xd8da6bf26964af9d7eed9e03e53415d37aa96045" client={thirdwebClient}>
    <AccountBlobbie className="h-20 w-20 rounded-full" />
  </AccountProvider>
}`}
        lang="tsx"
      />
    </>
  );
}

export function ConnectDetailsButtonClone() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Rebuild the Connected-Button
        </h2>
        <p className="max-w-[600px] text-lg">
          Using these headless components, you can easily build your own complex
          UI, such as our Connected-button.
        </p>
      </div>

      <CodeExample
        preview={<ConnectDetailsButtonClonePreview />}
        code={`import { AccountProvider, AccountAvatar, AccountName, AccountBalance, AccountAddress, AccountBlobbie } from "thirdweb/react";

function App() {
  return (
    <AccountProvider address={vitalikAddress} client={THIRDWEB_CLIENT}>
      <button
        type="button"
        className="flex min-w-[200px] flex-row items-center gap-2 rounded-md border bg-gray-800 px-4 py-2"
      >
        <AccountAvatar
          className="h-10 w-10 rounded-full"
          loadingComponent={
            <AccountBlobbie className="h-10 w-10 rounded-full" />
          }
          fallbackComponent={
            <AccountBlobbie className="h-10 w-10 rounded-full" />
          }
        />
        <div className="flex flex-col gap-1">
          <AccountName
            className="text-left"
            loadingComponent={
              <AccountAddress
                formatFn={shortenAddress}
                className="text-left"
              />
            }
            fallbackComponent={
              <AccountAddress
                formatFn={shortenAddress}
                className="text-left"
              />
            }
          />
          <div className="flex flex-row items-center gap-2">
            <AccountBalance
              className="text-left text-sm"
              chain={ethereum}
              loadingComponent={
                <span className="text-left text-sm">Loading...</span>
              }
              fallbackComponent={
                <span className="text-left text-sm">Loading...</span>
              }
            />
            <AccountBalance
              className="text-left text-sm"
              chain={ethereum}
              showBalanceInFiat="USD"
            />
          </div>
        </div>
      </button>
    </AccountProvider>
  )
}`}
        lang="tsx"
      />
    </>
  );
}
