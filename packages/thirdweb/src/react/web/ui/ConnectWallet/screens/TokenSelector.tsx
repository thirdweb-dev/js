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
import { useChainQuery } from "../../../../core/hooks/others/useChainQuery.js";
import { useTokenInfo } from "../../../../core/hooks/others/useTokenInfo.js";
import { useActiveAccount } from "../../../hooks/wallets/useActiveAccount.js";
import { ChainIcon } from "../../components/ChainIcon.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { TokenIcon } from "../../components/TokenIcon.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Input } from "../../components/formElements.js";
import { Text } from "../../components/text.js";
import { ChainButton, NetworkSelectorContent } from "../NetworkSelector.js";
import type { TokenInfo } from "../defaultTokens.js";
import type { ConnectLocale } from "../locale/types.js";
import { formatTokenBalance } from "./formatTokenBalance.js";
import {
  type ERC20OrNativeToken,
  NATIVE_TOKEN,
  isNativeToken,
} from "./nativeToken.js";

// NOTE: MUST NOT USE useConnectUI here because this UI can be used outside connect ui
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
  const chainQuery = useChainQuery(chain);

  // if input is undefined, it loads the native token
  // otherwise it loads the token with given address
  const tokenQuery = useTokenInfo({
    chain: chain,
    tokenAddress: input,
    client: props.client,
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
        client={props.client}
        connectLocale={props.connectLocale}
        showTabs={false}
        onBack={() => setScreen("base")}
        // pass swap supported chains
        chains={chainSelection.chains}
        closeModal={() => setScreen("base")}
        networkSelector={{
          renderChain(renderChainProps) {
            return (
              <ChainButton
                chain={renderChainProps.chain}
                confirming={false}
                switchingFailed={false}
                onClick={() => {
                  chainSelection.select(renderChainProps.chain);
                  setScreen("base");
                }}
                client={props.client}
                connectLocale={props.connectLocale}
              />
            );
          },
        }}
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
          <>
            <Container px="lg">
              <Text size="sm">Select Network</Text>
              <Spacer y="xxs" />
              <SelectTokenBtn
                fullWidth
                variant="secondary"
                onClick={() => {
                  setScreen("select-chain");
                }}
              >
                <ChainIcon
                  chainIcon={chainQuery.data?.icon}
                  size={iconSize.lg}
                  client={props.client}
                />

                {chainQuery.data ? (
                  <Text color="primaryText" size="sm">
                    {" "}
                    {chainQuery.data.name}
                  </Text>
                ) : (
                  <Skeleton height={fontSize.md} />
                )}

                <ChevronDownIcon
                  width={iconSize.sm}
                  height={iconSize.sm}
                  style={{
                    marginLeft: "auto",
                  }}
                />
              </SelectTokenBtn>
              <Spacer y="xl" />
              <Text size="sm">Select Token</Text>
            </Container>
          </>
        )}

        <Container px="lg">
          <Spacer y="xs" />
          <Input
            placeholder={locale.searchToken}
            variant="outline"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
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
              paddingTop: 0,
              paddingBottom: spacing.lg,
              // maxHeight: props.chainSelection ? "300px" : "400px",
            }}
          >
            {!input && (
              <SelectTokenButton
                onClick={() => {
                  props.onTokenSelect(NATIVE_TOKEN);
                }}
                chain={props.chain}
                token={NATIVE_TOKEN}
                client={props.client}
              />
            )}

            {filteredList.map((token) => {
              return (
                <SelectTokenButton
                  onClick={() => props.onTokenSelect(token)}
                  token={token}
                  key={token.address}
                  chain={props.chain}
                  client={props.client}
                />
              );
            })}
          </Container>
        )}

        {filteredList.length === 0 && tokenQuery.isLoading && input && (
          <Container
            animate="fadein"
            p="lg"
            flex="column"
            gap="md"
            center="both"
            style={{
              minHeight: "200px",
              paddingTop: 0,
            }}
            color="secondaryText"
          >
            <Spinner size="lg" color="accentText" />
          </Container>
        )}

        {filteredList.length === 0 && !tokenQuery.isLoading && input && (
          <Container
            animate="fadein"
            p="lg"
            flex="column"
            gap="md"
            center="both"
            style={{
              minHeight: "200px",
              paddingTop: 0,
            }}
            color="secondaryText"
          >
            <CrossCircledIcon width={iconSize.lg} height={iconSize.lg} />
            {locale.noTokensFound}
          </Container>
        )}

        <Spacer y="md" />
      </Container>
    </Container>
  );
}

function SelectTokenButton(props: {
  // token?: TokenInfo;
  token: ERC20OrNativeToken;
  chain: Chain;
  onClick: () => void;
  client: ThirdwebClient;
}) {
  const account = useActiveAccount();
  const tokenInfoQuery = useTokenInfo({
    chain: props.chain,
    tokenAddress: isNativeToken(props.token) ? undefined : props.token.address,
    client: props.client,
  });

  const tokenName = isNativeToken(props.token)
    ? tokenInfoQuery.data?.name
    : props.token.name;

  return (
    <SelectTokenBtn fullWidth variant="secondary" onClick={props.onClick}>
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
    queryKey: ["tokenBalance", props],
    queryFn: async () => {
      return getTokenBalance({
        account: props.account,
        chain: props.chain,
        client: props.client,
        tokenAddress: props.tokenAddress,
      });
    },
  });

  if (tokenBalanceQuery.data) {
    return <Text size="xs"> {formatTokenBalance(tokenBalanceQuery.data)}</Text>;
  }

  return <Skeleton height={fontSize.xs} width="100px" />;
}

const SelectTokenBtn = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    background: theme.colors.tertiaryBg,
    justifyContent: "flex-start",
    gap: spacing.sm,
    padding: spacing.sm,
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
      transform: "scale(1.01)",
    },
    transition: "background 200ms ease, transform 150ms ease",
  };
});
