import { Container } from "../../../components/basic";
import { Spacer } from "../../../components/Spacer";
import { Link, Text } from "../../../components/text";
import { useContext } from "react";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";
import { TOS } from "../Modal/TOS";
import { GlobeIcon } from "../icons/GlobalIcon";
import styled from "@emotion/styled";
import { Theme } from "../../../design-system";
import { keyframes } from "@emotion/react";

export function StartScreen() {
  const { termsOfServiceUrl, privacyPolicyUrl } = useContext(ModalConfigCtx);

  return (
    <Container fullHeight animate="fadein" flex="column">
      <Container
        expand
        flex="column"
        center="both"
        style={{
          minHeight: "300px",
        }}
      >
        <Container flex="row" center="x">
          <GlobalContainer>
            <GlobeIcon size={"150"} />
          </GlobalContainer>
        </Container>
        <Spacer y="xxl" />

        <Text center color="primaryText" weight={600}>
          Your gateway to the decentralized world
        </Text>

        <Spacer y="md" />

        <Text
          weight={500}
          color="secondaryText"
          style={{
            textAlign: "center",
            display: "block",
          }}
        >
          Connect a wallet to get started
        </Text>

        <Spacer y="xl" />

        <Link
          target="_blank"
          size="sm"
          center
          href="https://ethereum.org/en/wallets/find-wallet/"
        >
          New to wallets?
        </Link>
      </Container>

      {(termsOfServiceUrl || privacyPolicyUrl) && (
        <Container p="lg">
          <TOS
            termsOfServiceUrl={termsOfServiceUrl}
            privacyPolicyUrl={privacyPolicyUrl}
          />
        </Container>
      )}
    </Container>
  );
}

const floatingAnimation = keyframes`
  from {
    transform: translateY(4px);
  }
  to {
    transform: translateY(-4px);
  }
`;

const GlobalContainer = styled.div<{ theme?: Theme }>`
  color: ${(p) => p.theme.colors.accentText};
  filter: drop-shadow(0px 6px 10px ${(p) => p.theme.colors.accentText});
  animation: ${floatingAnimation} 2s ease infinite alternate;
`;
