import { Spacer } from "../../components/Spacer";
import { ModalTitle } from "../../components/modalElements";
import { fontSize, media, radius, spacing, Theme } from "../../design-system";
import { WalletMeta } from "./Connect";
import styled from "@emotion/styled";

export const WalletSelector: React.FC<{ walletsMeta: WalletMeta[] }> = (
  props,
) => {
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
        {props.walletsMeta.map((WalletMeta) => {
          return (
            <li key={WalletMeta.id}>
              <WalletButton
                type="button"
                onClick={() => {
                  WalletMeta.onClick();
                }}
              >
                {WalletMeta.icon}
                <WalletName>{WalletMeta.name}</WalletName>
                {WalletMeta.installed && (
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
