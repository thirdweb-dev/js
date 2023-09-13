import { Container } from "../../../components/basic";
import { Spacer } from "../../../components/Spacer";
import { Link, Text } from "../../../components/text";
import { useContext } from "react";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";
import { TOS } from "../Modal/TOS";
import { GlobeIcon } from "../icons/GlobalIcon";
import styled from "@emotion/styled";
import { Theme, spacing } from "../../../design-system";
import { keyframes } from "@emotion/react";
import { Img } from "../../../components/Img";

export function StartScreen() {
  const {
    termsOfServiceUrl,
    privacyPolicyUrl,
    welcomeScreen: WelcomeScreen,
  } = useContext(ModalConfigCtx);

  if (WelcomeScreen) {
    if (typeof WelcomeScreen === "function") {
      return <WelcomeScreen />;
    }
  }

  const title =
    (typeof WelcomeScreen === "object" ? WelcomeScreen?.title : undefined) ||
    "Your gateway to the decentralized world";

  const subtitle =
    (typeof WelcomeScreen === "object" ? WelcomeScreen?.subtitle : undefined) ||
    "Connect a wallet to get started";

  const img =
    typeof WelcomeScreen === "object" ? WelcomeScreen?.img : undefined;

  const showTOS = termsOfServiceUrl || privacyPolicyUrl;

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
          {img ? (
            <Img
              src={img.src}
              width={img.width ? String(img.width) : undefined}
              height={img.height ? String(img.height) : undefined}
            />
          ) : (
            <GlobalContainer>
              <GlobeIcon size={"150"} />
            </GlobalContainer>
          )}
        </Container>

        <Spacer y="xxl" />

        <Text center color="primaryText" weight={600}>
          {title}
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
          {subtitle}
        </Text>
      </Container>

      <Container px="xl">
        <LinkContainer data-seperator={!!showTOS}>
          <Link
            target="_blank"
            center
            href="https://ethereum.org/en/wallets/find-wallet/"
          >
            New to wallets?
          </Link>
        </LinkContainer>
      </Container>

      {showTOS && (
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

const LinkContainer = styled.div<{ theme?: Theme }>`
  &[data-seperator="true"] {
    padding-bottom: ${spacing.lg};
    border-bottom: 1px solid ${(p) => p.theme.colors.separatorLine};
  }

  &[data-seperator="false"] {
    padding: ${spacing.lg};
  }
`;

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
