import { useQuery } from "@tanstack/react-query";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { getOwnedTokens } from "../../../../../insight/get-tokens.js";
import { fontSize } from "../../../../core/design-system/index.js";
import { useWalletBalance } from "../../../../core/hooks/others/useWalletBalance.js";
import { useActiveAccount } from "../../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWalletChain } from "../../../../core/hooks/wallets/useActiveWalletChain.js";
import {
  defaultTokens,
  type SupportedTokens,
} from "../../../../core/utils/defaultTokens.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { TokenIcon } from "../../components/TokenIcon.js";
import { Text } from "../../components/text.js";
import type { ConnectLocale } from "../locale/types.js";
import { formatTokenBalance } from "./formatTokenBalance.js";
import {
  type ERC20OrNativeToken,
  isNativeToken,
  NATIVE_TOKEN,
} from "./nativeToken.js";

/**
 * @internal
 */
export function ViewTokens(props: {
  supportedTokens?: SupportedTokens;
  onBack: () => void;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
}) {
  return (
    <Container
      style={{
        minHeight: "300px",
      }}
    >
      <Container p="lg">
        <ModalHeader
          onBack={props.onBack}
          title={props.connectLocale.viewFunds.viewTokens}
        />
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
        <ViewTokensContent {...props} />
        <Spacer y="lg" />
      </Container>
    </Container>
  );
}

export function ViewTokensContent(props: {
  supportedTokens?: SupportedTokens;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
}) {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();

  const supportedTokens = props.supportedTokens || defaultTokens;

  const tokenList =
    (activeChain?.id ? supportedTokens[activeChain.id] : undefined) || [];

  const erc20TokensQuery = useQuery({
    // only fetch tokens if no explicit supported tokens are provided
    enabled:
      !!activeChain &&
      !!account &&
      (!props.supportedTokens || !props.supportedTokens[activeChain.id]),
    queryFn: async () => {
      if (!activeChain) {
        throw new Error("No active chain");
      }

      if (!account) {
        throw new Error("No account");
      }

      const result = await getOwnedTokens({
        chains: [activeChain],
        client: props.client,
        ownerAddress: account.address,
      });

      return result.filter(
        (token) =>
          !defaultTokens[activeChain.id]?.some(
            (t) => t.address.toLowerCase() === token.tokenAddress.toLowerCase(),
          ),
      );
    },
    queryKey: ["tokens", activeChain?.id, account?.address],
  });

  if (!activeChain || !account) {
    return null;
  }
  return (
    <>
      <TokenInfo
        chain={activeChain}
        client={props.client}
        token={NATIVE_TOKEN}
      />

      {tokenList.map((token) => {
        return (
          <TokenInfo
            chain={activeChain}
            client={props.client}
            key={token.address}
            token={token}
          />
        );
      })}

      {erc20TokensQuery.isLoading && (
        <Container flex="column" gap="sm" p="sm">
          <Skeleton height={fontSize.md} width="100%" />
          <Skeleton height={fontSize.md} width="100%" />
        </Container>
      )}

      {erc20TokensQuery.data?.map((token) => {
        return (
          <TokenInfo
            balanceData={token}
            chain={activeChain}
            client={props.client}
            key={token.tokenAddress}
            token={{
              address: token.tokenAddress,
              name: token.name ?? "",
              symbol: token.symbol ?? "",
            }}
          />
        );
      })}
    </>
  );
}

function TokenInfo(props: {
  token: ERC20OrNativeToken;
  chain: Chain;
  client: ThirdwebClient;
  balanceData?: {
    symbol: string;
    name: string;
    decimals: number;
    displayValue: string;
  };
}) {
  const account = useActiveAccount();
  const tokenBalanceQuery = useWalletBalance(
    {
      address: account?.address,
      chain: props.chain,
      client: props.client,
      tokenAddress: isNativeToken(props.token)
        ? undefined
        : props.token.address,
    },
    {
      enabled: props.balanceData === undefined,
    },
  );

  const tokenName = isNativeToken(props.token)
    ? tokenBalanceQuery.data?.name
    : props.token.name;

  return (
    <Container flex="row" gap="sm" p="sm">
      <TokenIcon
        chain={props.chain}
        client={props.client}
        size="lg"
        token={props.token}
      />

      <Container flex="column" gap="xxs">
        {tokenName ? (
          <Text color="primaryText" size="sm">
            {tokenName}
          </Text>
        ) : (
          <Skeleton height={fontSize.md} width="150px" />
        )}

        {props.balanceData ? (
          <Text size="xs"> {formatTokenBalance(props.balanceData)}</Text>
        ) : tokenBalanceQuery.data ? (
          <Text size="xs"> {formatTokenBalance(tokenBalanceQuery.data)}</Text>
        ) : (
          <Skeleton height={fontSize.xs} width="100px" />
        )}
      </Container>
    </Container>
  );
}
