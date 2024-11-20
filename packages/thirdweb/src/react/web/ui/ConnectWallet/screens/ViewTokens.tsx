import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import { formatNumber } from "../../../../../utils/formatNumber.js";
import { fontSize, iconSize } from "../../../../core/design-system/index.js";
import { useActiveWalletChain } from "../../../../core/hooks/wallets/useActiveWalletChain.js";
import {
  type SupportedTokens,
  defaultTokens,
} from "../../../../core/utils/defaultTokens.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Text } from "../../components/text.js";
import { AccountBalance } from "../../prebuilt/Account/balance.js";
import { TokenIcon } from "../../prebuilt/Token/icon.js";
import { TokenName } from "../../prebuilt/Token/name.js";
import { TokenProvider } from "../../prebuilt/Token/provider.js";
import type { ConnectLocale } from "../locale/types.js";
import {
  type ERC20OrNativeToken,
  NATIVE_TOKEN,
  isNativeToken,
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
          title={props.connectLocale.viewFunds.title}
          onBack={props.onBack}
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
  const activeChain = useActiveWalletChain();
  if (!activeChain) {
    return null;
  }
  const supportedTokens = props.supportedTokens || defaultTokens;

  const tokenList =
    (activeChain?.id ? supportedTokens[activeChain.id] : undefined) || [];

  return (
    <>
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
    </>
  );
}

function TokenInfo(props: {
  token: ERC20OrNativeToken;
  chain: Chain;
  client: ThirdwebClient;
}) {
  return (
    <TokenProvider
      address={
        isNativeToken(props.token) ? NATIVE_TOKEN_ADDRESS : props.token.address
      }
      chain={props.chain}
      client={props.client}
    >
      <Container flex="row" gap="sm" p="sm">
        <TokenIcon
          style={{ width: `${iconSize.lg}px`, height: `${iconSize.lg}px` }}
        />
        <Container flex="column" gap="xxs">
          <Text size="sm" color="primaryText">
            <TokenName
              loadingComponent={<Skeleton height={fontSize.md} width="150px" />}
              fallbackComponent={
                <Skeleton height={fontSize.md} width="150px" />
              }
            />
          </Text>
          <Text size="xs">
            {/* 
              We can use AccountBalance here because the Modal is wrapped inside an AccountProvider
              see: Details.tsx
            */}
            <AccountBalance
              chain={props.chain}
              formatFn={(num: number) => formatNumber(num, 5)}
              tokenAddress={
                isNativeToken(props.token)
                  ? NATIVE_TOKEN_ADDRESS
                  : props.token.address
              }
              loadingComponent={<Skeleton height={fontSize.xs} width="100px" />}
              fallbackComponent={
                <Skeleton height={fontSize.xs} width="100px" />
              }
            />
          </Text>
        </Container>
      </Container>
    </TokenProvider>
  );
}
