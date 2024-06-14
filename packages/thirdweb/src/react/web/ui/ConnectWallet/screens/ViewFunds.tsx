import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { fontSize } from "../../../../core/design-system/index.js";
import { useWalletBalance } from "../../../../core/hooks/others/useWalletBalance.js";
import { useActiveAccount } from "../../../hooks/wallets/useActiveAccount.js";
import { useActiveWalletChain } from "../../../hooks/wallets/useActiveWalletChain.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { TokenIcon } from "../../components/TokenIcon.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Text } from "../../components/text.js";
import { type SupportedTokens, defaultTokens } from "../defaultTokens.js";
import { formatTokenBalance } from "./formatTokenBalance.js";
import {
  type ERC20OrNativeToken,
  NATIVE_TOKEN,
  isNativeToken,
} from "./nativeToken.js";

/**
 * @internal
 */
export function ViewFunds(props: {
  supportedTokens?: SupportedTokens;
  onBack: () => void;
  client: ThirdwebClient;
}) {
  const activeChain = useActiveWalletChain();
  const supportedTokens = props.supportedTokens || defaultTokens;

  if (!activeChain) {
    return null;
  }

  const tokenList =
    (activeChain?.id ? supportedTokens[activeChain.id] : undefined) || [];

  return (
    <Container
      style={{
        minHeight: "300px",
      }}
    >
      <Container p="lg">
        <ModalHeader title="View Funds" onBack={props.onBack} />
      </Container>
      <Line />
      <Container
        px="sm"
        scrollY
        style={{
          maxHeight: "500px",
        }}
      >
        <Spacer y="md" />

        <TokenInfo
          token={NATIVE_TOKEN}
          chain={activeChain}
          client={props.client}
        />

        {tokenList.map((token) => {
          return (
            <TokenInfo
              token={token}
              key={token.address}
              chain={activeChain}
              client={props.client}
            />
          );
        })}
        <Spacer y="lg" />
      </Container>
    </Container>
  );
}

function TokenInfo(props: {
  token: ERC20OrNativeToken;
  chain: Chain;
  client: ThirdwebClient;
}) {
  const account = useActiveAccount();
  const tokenBalanceQuery = useWalletBalance({
    address: account?.address,
    chain: props.chain,
    tokenAddress: isNativeToken(props.token) ? undefined : props.token.address,
    client: props.client,
  });

  const tokenName = isNativeToken(props.token)
    ? tokenBalanceQuery.data?.name
    : props.token.name;

  return (
    <Container flex="row" gap="sm" p="sm">
      <TokenIcon
        token={props.token}
        chain={props.chain}
        size="lg"
        client={props.client}
      />

      <Container flex="column" gap="xxs">
        {tokenName ? (
          <Text size="sm" color="primaryText">
            {tokenName}
          </Text>
        ) : (
          <Skeleton height={fontSize.md} width="150px" />
        )}

        {tokenBalanceQuery.data ? (
          <Text size="xs"> {formatTokenBalance(tokenBalanceQuery.data)}</Text>
        ) : (
          <Skeleton height={fontSize.xs} width="100px" />
        )}
      </Container>
    </Container>
  );
}
