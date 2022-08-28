import { chainLogos } from "./icons/chain-logos";
import { CoinbaseWalletIcon } from "./icons/coinbase-wallet";
import { MetamaskIcon } from "./icons/metamask";
import { WalletConnectIcon } from "./icons/wallet-connect";
import styled from "@emotion/styled";
import React from "react";

interface StyledSvg {
  boxSize?: string;
}

const StyledSvg = styled.svg<StyledSvg>`
  border-radius: 0.25em;
  flex-shrink: 0;
  ${(props) =>
    props.boxSize
      ? `width: ${props.boxSize};
    height: ${props.boxSize};`
      : ""}
`;

const iconMap = {
  metamask: MetamaskIcon,
  walletConnect: WalletConnectIcon,
  coinbaseWallet: CoinbaseWalletIcon,
  ...chainLogos,
} as const;

export interface IconProps extends StyledSvg {
  name: keyof typeof iconMap;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const icon = iconMap[name];
  return (
    <StyledSvg {...icon.svgProps} {...props}>
      {icon.paths}
    </StyledSvg>
  );
};
