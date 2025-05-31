# Web UI Components Catalog

This document catalogs the UI components found within `packages/thirdweb/src/react/web/ui`.

## Core Components (`packages/thirdweb/src/react/web/ui/components`)

| Component           | Occurrences |
| ------------------- | ----------- |
| Container           | 100+        |
| Text                | 93          |
| Spacer              | 85          |
| Button              | 58          |
| Skeleton            | 40          |
| ModalHeader         | 40          |
| Spinner             | 31          |
| Img                 | 31          |
| Line                | 28          |
| ChainIcon           | 19          |
| TokenIcon           | 16          |
| Input               | 11          |
| SwitchNetworkButton | 10          |
| WalletImage         | 11          |
| ToolTip             | 6           |
| Drawer              | 5           |
| QRCode              | 5           |
| CopyIcon            | 4           |
| ChainActiveDot      | 3           |
| Label               | 3           |
| ModalTitle          | 3           |
| TextDivider         | 3           |
| DynamicHeight       | 3           |
| StepBar             | 2           |
| IconContainer       | 2           |
| OTPInput            | 2           |
| ChainName           | 1           |
| BackButton          | 1           |
| IconButton          | 1           |
| ButtonLink          | 1           |
| Overlay             | 1           |
| Tabs                | 1           |
| FadeIn              | 0           |
| InputContainer      | 0           |

## Prebuilt Components (`packages/thirdweb/src/react/web/ui/prebuilt`)

### NFT

| Component      | Occurrences (internal) |
| -------------- | ---------------------- |
| NFTName        | 0                      |
| NFTMedia       | 0                      |
| NFTDescription | 0                      |
| NFTProvider    | 0                      |

### Account

| Component      | Occurrences (internal) |
| -------------- | ---------------------- |
| AccountBalance | 6                      |
| AccountAvatar  | 2                      |
| AccountBlobbie | 4                      |
| AccountName    | 2                      |
| AccountAddress | 4                      |

### Chain

| Component     | Occurrences (internal) |
| ------------- | ---------------------- |
| ChainName     | 5                      |
| ChainIcon     | 7                      |
| ChainProvider | 2                      |

### Token

| Component     | Occurrences (internal) |
| ------------- | ---------------------- |
| TokenName     | 0                      |
| TokenSymbol   | 12                     |
| TokenIcon     | 7                      |
| TokenProvider | 0                      |

### Wallet

| Component  | Occurrences (internal) |
| ---------- | ---------------------- |
| WalletName | 0                      |
| WalletIcon | 0                      |

### Thirdweb

| Component                 | Occurrences (internal) |
| ------------------------- | ---------------------- |
| ClaimButton               | 0                      |
| BuyDirectListingButton    | 0                      |
| CreateDirectListingButton | 0                      |

## Re-used Components (`packages/thirdweb/src/react/web/ui`)

### Non-Core/Non-Prebuilt Components (ConnectWallet folder analysis)

| Component                      | Occurrences | Source/Type                  |
| ------------------------------ | ----------- | ---------------------------- |
| LoadingScreen                  | 19          | Wallets shared component     |
| Suspense                       | 8           | React built-in               |
| WalletRow                      | 8           | Buy/swap utility component   |
| PoweredByThirdweb              | 6           | Custom branding component    |
| Modal                          | 5           | Core UI component            |
| WalletUIStatesProvider         | 4           | Wallet state management      |
| NetworkSelectorContent         | 4           | Network selection component  |
| PayTokenIcon                   | 3           | Buy screen utility component |
| FiatValue                      | 3           | Buy/swap utility component   |
| TOS                            | 3           | Terms of service component   |
| ErrorState                     | 3           | Error handling component     |
| AnimatedButton                 | 3           | Animation component          |
| ConnectModalContent            | 3           | Modal content layout         |
| AnyWalletConnectUI             | 2           | Wallet connection screen     |
| SmartConnectUI                 | 2           | Smart wallet connection UI   |
| WalletEntryButton              | 2           | Wallet selection button      |
| TokenSelector                  | 2           | Token selection component    |
| SignatureScreen                | 2           | Wallet signature screen      |
| WalletSwitcherConnectionScreen | 2           | Wallet switching UI          |
| ErrorText                      | 2           | Error display component      |
| SwapSummary                    | 2           | Swap transaction summary     |
| EstimatedTimeAndFees           | 2           | Transaction info component   |

### Other Re-used Components

| Component | Occurrences |
| --------- | ----------- |
| PayEmbed  | 1           |
| SiteEmbed | 0           |
| SiteLink  | 0           |

**Note:** Occurrences are based on direct import and usage (e.g., `<ComponentName`). This count excludes test files and documentation examples, counting only internal usage within the src/react/web folder. The analysis focuses on commonly used components that are NOT from the core components or prebuilt folders, revealing key reusable components for state management, error handling, animations, and branding.
