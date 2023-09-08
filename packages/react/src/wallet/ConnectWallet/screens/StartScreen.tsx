import styled from "@emotion/styled";
import {
  ScreenContainer,
  Flex,
  ScreenBottomContainer,
} from "../../../components/basic";
import { HelperLink } from "../../../components/modalElements";
import { Spacer } from "../../../components/Spacer";
import { NeutralText, SecondaryText } from "../../../components/text";
import { fontSize, Theme } from "../../../design-system";
import { EthIcon } from "../icons/EthIcon";
import { flyingAnimation } from "../../../components/animations";

export function StartScreen() {
  return (
    <>
      <ScreenContainer
        style={{
          height: "100%",
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Flex
          justifyContent="center"
          style={{
            position: "relative",
            animation: `${flyingAnimation} 1s ease inifinite`,
          }}
        >
          <EthIcon size="150" />
        </Flex>
        <Spacer y="xxl" />
        <NeutralText
          style={{
            textAlign: "center",
            display: "block",
            fontWeight: 500,
          }}
        >
          Your gateway to the decentralized world
        </NeutralText>
        <Spacer y="md" />
        <SecondaryText
          style={{
            textAlign: "center",
            display: "block",
          }}
        >
          Connect a wallet to get started
        </SecondaryText>
      </ScreenContainer>

      <ScreenBottomContainer
        style={{
          border: "none",
        }}
      >
        <SecondaryLink
          target="_blank"
          href="https://ethereum.org/en/wallets/find-wallet/"
          style={{
            lineHeight: 1,
            fontSize: fontSize.md,
            textAlign: "center",
          }}
        >
          New to wallets?
        </SecondaryLink>
      </ScreenBottomContainer>
    </>
  );
}

const SecondaryLink = /* @__PURE__ */ styled(HelperLink)<{ theme?: Theme }>`
  color: ${(p) => p.theme.text.secondary};
  transition: color 200ms ease;
  &:hover {
    color: ${(p) => p.theme.text.neutral};
  }
`;
