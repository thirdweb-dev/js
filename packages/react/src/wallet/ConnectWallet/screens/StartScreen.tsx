import styled from "@emotion/styled";
import { ScreenBottomContainer, Container } from "../../../components/basic";
import { HelperLink } from "../../../components/modalElements";
import { Spacer } from "../../../components/Spacer";
import { Text } from "../../../components/text";
import { fontSize, Theme } from "../../../design-system";
import { EthIcon } from "../icons/EthIcon";

export function StartScreen() {
  return (
    <>
      <Container
        fullHeight
        flex="column"
        center="both"
        style={{
          minHeight: "300px",
        }}
      >
        <Container flex="row" center="x">
          <EthIcon size="150" />
        </Container>
        <Spacer y="xxl" />

        <Text center color="neutral" weight={500}>
          Your gateway to the decentralized world
        </Text>

        <Spacer y="md" />

        <Text
          color="secondary"
          style={{
            textAlign: "center",
            display: "block",
          }}
        >
          Connect a wallet to get started
        </Text>
      </Container>

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
