---
"@thirdweb-dev/react-native": minor
"@thirdweb-dev/react-core": minor
"@thirdweb-dev/wallets": patch
"@thirdweb-dev/react": minor
---

- Fix double connection issue when Connecting a Safe / Smart Wallet. Now the personal wallet will not be set as the active wallet - only the final wallet will be set as the active wallet. This fixes the issue of hooks like `useWallet`, `useAddress`, `useConnectionStatus` etc showing the wrong wallet / address / connection status for a brief moment when connecting a Safe / Smart Wallet.

- Add `ConnectEmbed` component and `useShowConnectEmbed` hook to allow for embedding the ConnectWallet's Modal directly into the page.
- `useShowConnectEmbed` returns `true`` if the `<ConnectEmbed />`should be rendered. It returns`true`` if either one of the following conditions are met:

  - the wallet is NOT connected
  - the wallet IS connected but the user is NOT signed in and `auth` is required ( loginOptional is NOT set to false )

  ```tsx
  function Example() {
    const loginOptional = false;
    const showConnectEmbed = useShowConnectEmbed(loginOptional);

    return (
      <div>
        <ConnectEmbed
          auth={{
            loginOptional,
          }}
        />
      </div>
    );
  }
  ```

- Show "Disconnect Wallet" option in "Sign in" Screen and don't disconnect wallet instead of disconnecting the wallet when "Sign in" screen is dismissed by closing the modal. This makes this screen reusable for both ConnectWallet and ConnectEmbed components and also improves the user experience.
