import { useState } from "react";
import { Img } from "../../components/Img";
import { Spacer } from "../../components/Spacer";
import { Button, IconButton } from "../../components/buttons";
import { Input } from "../../components/formElements";
import { HelperLink, ModalTitle } from "../../components/modalElements";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
  Theme,
} from "../../design-system";
import { WalletMeta } from "../types";
import styled from "@emotion/styled";
import { ChevronRightIcon } from "@radix-ui/react-icons";

export const WalletSelector: React.FC<{
  walletsMeta: WalletMeta[];
  onGetStarted: () => void;
  guestMode?: boolean;
  onGuestConnect: () => void;
  onUsernameSet: (username: string) => void;
}> = (props) => {
  const showGetStarted = !!props.walletsMeta[0].meta.urls && !props.guestMode;
  const smartWalletMeta = props.walletsMeta.find((w) => w.id === "SmartWallet");
  const walletsMeta = props.walletsMeta.filter(
    (w) => w.id !== "localWallet" && w.id !== "SmartWallet",
  );
  const [username, setUsername] = useState("");

  return (
    <>
      <ModalTitle>Choose your wallet</ModalTitle>
      <Spacer y="xl" />

      {smartWalletMeta && (
        <>
          <div
            style={{
              position: "relative",
            }}
          >
            <Input
              autoComplete="off"
              name="smart-wallet-username"
              id="smart-wallet-username"
              autoFocus={false}
              variant="secondary"
              placeholder="Login with username"
              value={username}
              onChange={(e) => {
                setUsername(e.currentTarget.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  smartWalletMeta.onClick();
                  props.onUsernameSet(e.currentTarget.value);
                }
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: spacing.sm,
                transform: "translateY(-50%)",
              }}
            >
              <IconButton
                aria-label="Connect"
                variant="secondary"
                onClick={() => {
                  smartWalletMeta.onClick();
                  props.onUsernameSet(username);
                }}
              >
                <ChevronRightIcon width={iconSize.md} height={iconSize.md} />
              </IconButton>
            </div>
          </div>
          <Spacer y="xl" />
        </>
      )}

      <WalletSelection walletsMeta={walletsMeta} />

      {props.guestMode && (
        <>
          <Spacer y="xl" />
          <Button
            variant="link"
            style={{
              width: "100%",
              padding: 0,
            }}
            onClick={props.onGuestConnect}
          >
            {" "}
            Continue as guest
          </Button>
        </>
      )}

      {showGetStarted && (
        <>
          <Spacer y="xl" />
          <HelperLink
            as="button"
            onClick={props.onGetStarted}
            style={{
              display: "block",
              width: "100%",
              textAlign: "center",
            }}
          >
            Need help getting started?
          </HelperLink>
        </>
      )}
    </>
  );
};

export const WalletSelection: React.FC<{ walletsMeta: WalletMeta[] }> = (
  props,
) => {
  // show the installed wallets first
  const sortedWalletsMeta = props.walletsMeta.sort((a, b) => {
    if (a.installed && !b.installed) {
      return -1;
    }
    if (!a.installed && b.installed) {
      return 1;
    }
    return 0;
  });

  return (
    <WalletList>
      {sortedWalletsMeta.map((walletMeta) => {
        return (
          <li key={walletMeta.id}>
            <WalletButton
              type="button"
              onClick={() => {
                walletMeta.onClick();
              }}
            >
              <Img
                src={walletMeta.meta.iconURL}
                width={iconSize.lg}
                height={iconSize.lg}
                loading="eager"
              />
              <WalletName>{walletMeta.meta.name}</WalletName>
              {walletMeta.installed && <InstallBadge> Installed </InstallBadge>}
            </WalletButton>
          </li>
        );
      })}
    </WalletList>
  );
};

const WalletList = styled.ul`
  all: unset;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  box-sizing: border-box;
`;

const WalletButton = styled.button<{ theme?: Theme }>`
  all: unset;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radius.sm};
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  color: ${(p) => p.theme.text.neutral};
  background: ${(p) => p.theme.bg.elevated};
  transition: 100ms ease;
  &:hover {
    background: ${(p) => p.theme.bg.highlighted};
  }
`;

const InstallBadge = styled.span<{ theme?: Theme }>`
  padding: ${spacing.xxs} ${spacing.xs};
  font-size: ${fontSize.xs};
  background-color: ${(p) => p.theme.badge.secondary};
  border-radius: ${radius.lg};
  margin-left: auto;
`;

const WalletName = styled.span`
  font-size: ${fontSize.md};
  font-weight: 500;
`;
