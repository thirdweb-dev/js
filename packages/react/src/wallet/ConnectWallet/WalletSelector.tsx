import { Img } from "../../components/Img";
import { Spacer } from "../../components/Spacer";
import { Spinner } from "../../components/Spinner";
import { ModalTitle } from "../../components/modalElements";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
  Theme,
} from "../../design-system";
import { WalletMeta } from "../types";
import styled from "@emotion/styled";
import { useState } from "react";

export const WalletSelector: React.FC<{ walletsMeta: WalletMeta[] }> = (
  props,
) => {
  const [connectingIndex, setConnectingIndex] = useState(-1);
  return (
    <>
      <ModalTitle
        style={{
          textAlign: "left",
        }}
      >
        Choose your wallet
      </ModalTitle>

      <Spacer y="xl" />

      <WalletList>
        {props.walletsMeta.map((walletMeta, i) => {
          return (
            <li key={walletMeta.id}>
              <WalletButton
                type="button"
                onClick={() => {
                  setConnectingIndex(i);
                  walletMeta.onClick();
                }}
              >
                <Img
                  src={walletMeta.iconURL}
                  width={iconSize.lg}
                  height={iconSize.lg}
                  loading="eager"
                />
                <WalletName>{walletMeta.name}</WalletName>
                {connectingIndex === i && <Spinner size="sm" color="primary" />}
                {walletMeta.installed && (
                  <InstallBadge> Installed </InstallBadge>
                )}
              </WalletButton>
            </li>
          );
        })}
      </WalletList>
    </>
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
