import { Container } from "../../../components/basic";
import { Spacer } from "../../../components/Spacer";
import { Link, Text } from "../../../components/text";
import { EthIcon } from "../icons/EthIcon";
import { useContext } from "react";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";
import { TOS } from "../Modal/TOS";

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
          <EthIcon size="150" />
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
