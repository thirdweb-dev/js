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
        p="lg"
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

        <Text center color="primaryText" weight={600} multiline>
          {title}
        </Text>

        <Spacer y="md" />

        <Text
          color="secondaryText"
          multiline
          style={{
            textAlign: "center",
          }}
        >
          {subtitle}
        </Text>
      </Container>

      <Container py="lg" flex="column" gap="lg">
        <Link
          target="_blank"
          center
          href="https://blog.thirdweb.com/web3-wallet/"
        >
          New to wallets?
        </Link>

        {showTOS && (
          <TOS
            termsOfServiceUrl={termsOfServiceUrl}
            privacyPolicyUrl={privacyPolicyUrl}
          />
        )}
      </Container>
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
