import styled from "@emotion/styled";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { shortenAddress } from "../../../../../utils/address.js";
import { AccountProvider } from "../../../../core/account/provider.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { WalletProvider } from "../../../../core/wallet/provider.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { AccountAvatar } from "../../prebuilt/Account/avatar.js";
import { AccountBlobbie } from "../../prebuilt/Account/blobbie.js";
import { AccountName } from "../../prebuilt/Account/name.js";
import { WalletIcon } from "../../prebuilt/Wallet/icon.js";
import type { ActiveWalletInfo } from "../swap-widget/types.js";

export function ActiveWalletDetails(props: {
  activeWalletInfo: ActiveWalletInfo;
  client: ThirdwebClient;
  onClick: () => void;
}) {
  const wallet = props.activeWalletInfo.activeWallet;
  const account = props.activeWalletInfo.activeAccount;

  const accountBlobbie = (
    <AccountBlobbie
      style={{
        width: `${iconSize.xs}px`,
        height: `${iconSize.xs}px`,
        borderRadius: radius.full,
      }}
    />
  );
  const accountAvatarFallback = (
    <WalletIcon
      style={{
        width: `${iconSize.xs}px`,
        height: `${iconSize.xs}px`,
      }}
      fallbackComponent={accountBlobbie}
      loadingComponent={accountBlobbie}
    />
  );

  return (
    <WalletButton
      variant="ghost-solid"
      style={{
        paddingInline: spacing.xxs,
        paddingBlock: "2px",
      }}
      onClick={props.onClick}
    >
      <AccountProvider address={account.address} client={props.client}>
        <WalletProvider id={wallet.id}>
          <Container flex="row" gap="xxs" center="y">
            <AccountAvatar
              style={{
                width: `${iconSize.xs}px`,
                height: `${iconSize.xs}px`,
                borderRadius: radius.full,
                objectFit: "cover",
              }}
              fallbackComponent={accountAvatarFallback}
              loadingComponent={accountAvatarFallback}
            />

            <span
              style={{
                fontSize: fontSize.xs,
                letterSpacing: "0.025em",
              }}
            >
              <AccountName
                fallbackComponent={
                  <span>{shortenAddress(account.address)}</span>
                }
                loadingComponent={
                  <span>{shortenAddress(account.address)}</span>
                }
              />
            </span>
          </Container>
        </WalletProvider>
      </AccountProvider>
    </WalletButton>
  );
}

const WalletButton = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    color: theme.colors.secondaryText,
    transition: "color 200ms ease",
    "&:hover": {
      color: theme.colors.primaryText,
    },
  };
});
