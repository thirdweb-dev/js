import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useChainQuery } from "../../../hooks/others/useChainQuery.js";
import { useWalletBalance } from "../../../hooks/others/useWalletBalance.js";
import { useTWLocale } from "../../../providers/locale-provider.js";
import { useActiveAccount } from "../../../providers/wallet-provider.js";
import { ChainIcon, fallbackChainIcon } from "../../components/ChainIcon.js";
import { Img } from "../../components/Img.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Input } from "../../components/formElements.js";
import { useCustomTheme } from "../../design-system/CustomThemeProvider.js";
import { spacing, iconSize, fontSize } from "../../design-system/index.js";
import type { TokenInfo } from "../defaultTokens.js";
import { Text } from "../../components/text.js";
import styled from "@emotion/styled";
import type { Chain } from "../../../../chains/types.js";

/**
 *
 * @internal
 */
export function TokenSelector(props: {
  onTokenSelect: (token?: TokenInfo | { nativeToken: true }) => void;
  onBack: () => void;
  tokenList: TokenInfo[];
  chain: Chain;
}) {
  const [input, setInput] = useState("");
  const activeAccount = useActiveAccount();
  const chain = props.chain;

  // if input is undefined, it loads the native token
  // otherwise it loads the token with given address
  const tokenQuery = useWalletBalance({
    account: activeAccount,
    chain: chain,
    tokenAddress: input,
  });

  const locale = useTWLocale().connectWallet.sendFundsScreen;
  const chainQuery = useChainQuery(chain);

  let tokenList = props.tokenList;

  if (tokenQuery.data && input) {
    tokenList = [
      {
        ...tokenQuery.data,
        icon: chainQuery.data?.icon?.url || "",
        address: input,
      },
      ...tokenList,
    ];
  }

  const findingToken = input && tokenQuery.isLoading;

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

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title={locale.selectTokenTitle} />
        <Spacer y="xl" />
        <Input
          placeholder={locale.searchToken}
          variant="outline"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
      </Container>

      {filteredList.length > 0 && (
        <Container
          flex="column"
          gap="xs"
          p="md"
          scrollY
          style={{
            paddingTop: 0,
            paddingBottom: spacing.lg,
            maxHeight: "400px",
          }}
        >
          {!input && (
            <SelectTokenButton
              onClick={() => {
                props.onTokenSelect({ nativeToken: true });
              }}
              chain={props.chain}
            />
          )}

          {filteredList.map((token) => {
            return (
              <SelectTokenButton
                onClick={() => props.onTokenSelect(token)}
                token={token}
                key={token.address}
                chain={props.chain}
              />
            );
          })}
        </Container>
      )}

      {(findingToken ||
        (filteredList.length === 0 && tokenQuery.isLoading)) && (
        <Container
          animate="fadein"
          p="lg"
          flex="column"
          gap="md"
          center="both"
          style={{
            minHeight: "150px",
            paddingTop: 0,
          }}
          color="secondaryText"
        >
          <Spinner size="lg" color="accentText" />
        </Container>
      )}

      {filteredList.length === 0 && !tokenQuery.isLoading && (
        <Container
          animate="fadein"
          p="lg"
          flex="column"
          gap="md"
          center="both"
          style={{
            minHeight: "150px",
            paddingTop: 0,
          }}
          color="secondaryText"
        >
          <CrossCircledIcon width={iconSize.lg} height={iconSize.lg} />
          {locale.noTokensFound}
        </Container>
      )}
    </Container>
  );
}

function SelectTokenButton(props: {
  token?: TokenInfo;
  chain: Chain;
  onClick: () => void;
}) {
  const account = useActiveAccount();
  const balanceQuery = useWalletBalance({
    account,
    chain: props.chain,
    tokenAddress: props.token?.address,
  });

  const chainQuery = useChainQuery(props.chain);

  const tokenName = props.token?.name || balanceQuery.data?.name;

  return (
    <SelectTokenBtn fullWidth variant="secondary" onClick={props.onClick}>
      {/* icon */}
      {props.token?.icon ? (
        <Img
          width={iconSize.lg}
          height={iconSize.lg}
          src={props.token.icon}
          fallbackImage={fallbackChainIcon}
        />
      ) : chainQuery.data ? (
        <ChainIcon chain={chainQuery.data} size={iconSize.lg} />
      ) : (
        <Skeleton height={iconSize.lg} width={iconSize.lg} />
      )}

      <Container flex="column" gap="xs">
        {tokenName ? (
          <Text size="sm" color="primaryText">
            {tokenName}
          </Text>
        ) : (
          <Skeleton height={fontSize.md} width="150px" />
        )}

        {balanceQuery.data ? (
          <Text size="xs"> {formatTokenBalance(balanceQuery.data)}</Text>
        ) : (
          <Skeleton height={fontSize.xs} width="100px" />
        )}
      </Container>
    </SelectTokenBtn>
  );
}

const SelectTokenBtn = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    background: "transparent",
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

/**
 * @internal
 * @param balanceData
 * @returns
 */
export function formatTokenBalance(balanceData: {
  symbol: string;
  name: string;
  decimals: number;
  displayValue: string;
}) {
  return Number(balanceData.displayValue).toFixed(3) + " " + balanceData.symbol;
}
