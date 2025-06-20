import styled from "@emotion/styled";
import { ChevronDownIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Account } from "../../../../../wallets/interfaces/wallet.js";
import { getTokenBalance } from "../../../../../wallets/utils/getTokenBalance.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../../core/design-system/index.js";
import {
  useChainIconUrl,
  useChainName,
} from "../../../../core/hooks/others/useChainQuery.js";
import { useTokenInfo } from "../../../../core/hooks/others/useTokenInfo.js";
import { useActiveAccount } from "../../../../core/hooks/wallets/useActiveAccount.js";
import type { TokenInfo } from "../../../../core/utils/defaultTokens.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { ChainIcon } from "../../components/ChainIcon.js";
import { Input } from "../../components/formElements.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { TokenIcon } from "../../components/TokenIcon.js";
import { Text } from "../../components/text.js";
import type { ConnectLocale } from "../locale/types.js";
import { ChainButton, NetworkSelectorContent } from "../NetworkSelector.js";
import { formatTokenBalance } from "./formatTokenBalance.js";
import {
  type ERC20OrNativeToken,
  isNativeToken,
  NATIVE_TOKEN,
} from "./nativeToken.js";

// Note: TokenSelector can be used when wallet may or may not be connected

/**
 *
 * @internal
 */
export function TokenSelector(props: {
  onTokenSelect: (token: ERC20OrNativeToken) => void;
  onBack: () => void;
  tokenList: TokenInfo[];
  chain: Chain;
  chainSelection?: {
    chains: Chain[];
    select: (chain: Chain) => void;
  };
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
  modalTitle?: string;
}) {
  const [screen, setScreen] = useState<"base" | "select-chain">("base");
  const [input, setInput] = useState("");
  const chain = props.chain;

  const chainNameQuery = useChainName(chain);
  const chainIconQuery = useChainIconUrl(chain);

  // if input is undefined, it loads the native token
  // otherwise it loads the token with given address
  const tokenQuery = useTokenInfo({
    chain: chain,
    client: props.client,
    tokenAddress: input,
  });

  const locale = props.connectLocale.sendFundsScreen;

  let tokenList = props.tokenList;

  if (tokenQuery.data && input) {
    tokenList = [
      {
        ...tokenQuery.data,
        address: input,
      },
      ...tokenList,
    ];
  }

  const filteredList = input
    ? tokenList.filter((t) => {
        const inputStr = input.toLowerCase();
        return (
          t.name.toLowerCase().includes(inputStr) ||
          t.symbol.toLowerCase().includes(inputStr) ||
          t.address.includes(input)
        );
      })
    : tokenList;

  const { chainSelection } = props;

  if (screen === "select-chain" && chainSelection) {
    return (
      <NetworkSelectorContent
        chains={chainSelection.chains}
        client={props.client}
        closeModal={() => setScreen("base")}
        connectLocale={props.connectLocale}
        // pass swap supported chains
        networkSelector={{
          renderChain(renderChainProps) {
            return (
              <ChainButton
                chain={renderChainProps.chain}
                client={props.client}
                confirming={false}
                connectLocale={props.connectLocale}
                onClick={() => {
                  chainSelection.select(renderChainProps.chain);
                  setScreen("base");
                }}
                switchingFailed={false}
              />
            );
          },
        }}
        onBack={() => setScreen("base")}
        showTabs={false}
      />
    );
  }

  return (
    <Container
      animate="fadein"
      style={{
        minHeight: "300px",
      }}
    >
      <Container p="lg">
        <ModalHeader
          onBack={props.onBack}
          title={props.modalTitle || locale.selectTokenTitle}
        />
      </Container>

      <Line />

      <Container
        scrollY
        style={{
          maxHeight: "450px",
        }}
      >
        <Spacer y="md" />

        {props.chainSelection && (
          <Container px="lg">
            <Text size="sm">Select Network</Text>
            <Spacer y="xxs" />
            <SelectTokenBtn
              fullWidth
              onClick={() => {
                setScreen("select-chain");
              }}
              variant="secondary"
            >
              <ChainIcon
                chainIconUrl={chainIconQuery.url}
                client={props.client}
                size={iconSize.lg}
              />

              {chainNameQuery.name ? (
                <Text color="primaryText" size="sm">
                  {chainNameQuery.name}
                </Text>
              ) : (
                <Skeleton height={fontSize.md} />
              )}

              <ChevronDownIcon
                height={iconSize.sm}
                style={{
                  marginLeft: "auto",
                }}
                width={iconSize.sm}
              />
            </SelectTokenBtn>
            <Spacer y="xl" />
            <Text size="sm">Select Token</Text>
          </Container>
        )}

        <Container px="lg">
          <Spacer y="xs" />
          <Input
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder={locale.searchToken}
            value={input}
            variant="outline"
          />
        </Container>

        <Spacer y="md" />

        {(filteredList.length > 0 || !input) && (
          <Container
            flex="column"
            gap="xs"
            px="lg"
            scrollY
            style={{
              paddingBottom: spacing.lg,
              paddingTop: 0,
            }}
          >
            {!input && (
              <SelectTokenButton
                chain={props.chain}
                client={props.client}
                onClick={() => {
                  props.onTokenSelect(NATIVE_TOKEN);
                }}
                token={NATIVE_TOKEN}
              />
            )}

            {filteredList.map((token) => {
              return (
                <SelectTokenButton
                  chain={props.chain}
                  client={props.client}
                  key={token.address}
                  onClick={() => props.onTokenSelect(token)}
                  token={token}
                />
              );
            })}
          </Container>
        )}

        {filteredList.length === 0 && tokenQuery.isLoading && input && (
          <Container
            animate="fadein"
            center="both"
            color="secondaryText"
            flex="column"
            gap="md"
            p="lg"
            style={{
              minHeight: "200px",
              paddingTop: 0,
            }}
          >
            <Spinner color="accentText" size="lg" />
          </Container>
        )}

        {filteredList.length === 0 && !tokenQuery.isLoading && input && (
          <Container
            animate="fadein"
            center="both"
            color="secondaryText"
            flex="column"
            gap="md"
            p="lg"
            style={{
              minHeight: "200px",
              paddingTop: 0,
            }}
          >
            <CrossCircledIcon height={iconSize.lg} width={iconSize.lg} />
            {locale.noTokensFound}
          </Container>
        )}

        <Spacer y="md" />
      </Container>
    </Container>
  );
}

function SelectTokenButton(props: {
  token: ERC20OrNativeToken;
  chain: Chain;
  onClick: () => void;
  client: ThirdwebClient;
}) {
  const account = useActiveAccount();
  const tokenInfoQuery = useTokenInfo({
    chain: props.chain,
    client: props.client,
    tokenAddress: isNativeToken(props.token) ? undefined : props.token.address,
  });

  const tokenName = isNativeToken(props.token)
    ? tokenInfoQuery.data?.name
    : props.token.name;

  return (
    <SelectTokenBtn fullWidth onClick={props.onClick} variant="secondary">
      <TokenIcon
        chain={props.chain}
        client={props.client}
        size="lg"
        token={props.token}
      />

      <Container flex="column" gap="4xs">
        {tokenName ? (
          <Text color="primaryText" size="sm">
            {tokenName}
          </Text>
        ) : (
          <Skeleton height={fontSize.md} width="150px" />
        )}

        {account && (
          <TokenBalance
            account={account}
            chain={props.chain}
            client={props.client}
            tokenAddress={
              isNativeToken(props.token) ? undefined : props.token.address
            }
          />
        )}
      </Container>
    </SelectTokenBtn>
  );
}

function TokenBalance(props: {
  account: Account;
  chain: Chain;
  client: ThirdwebClient;
  tokenAddress?: string;
}) {
  const tokenBalanceQuery = useQuery({
    queryFn: async () => {
      return getTokenBalance({
        account: props.account,
        chain: props.chain,
        client: props.client,
        tokenAddress: props.tokenAddress,
      });
    },
    queryKey: ["tokenBalance", props],
  });

  if (tokenBalanceQuery.data) {
    return <Text size="xs"> {formatTokenBalance(tokenBalanceQuery.data)}</Text>;
  }

  return <Skeleton height={fontSize.xs} width="100px" />;
}

const SelectTokenBtn = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
      transform: "scale(1.01)",
    },
    background: theme.colors.tertiaryBg,
    gap: spacing.sm,
    justifyContent: "flex-start",
    padding: spacing.sm,
    transition: "background 200ms ease, transform 150ms ease",
  };
});
