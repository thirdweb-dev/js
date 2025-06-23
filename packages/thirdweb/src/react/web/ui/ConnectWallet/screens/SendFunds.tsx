import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useId, useState } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../../core/design-system/index.js";
import { useWalletBalance } from "../../../../core/hooks/others/useWalletBalance.js";
import { useActiveAccount } from "../../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWalletChain } from "../../../../core/hooks/wallets/useActiveWalletChain.js";
import { useSendToken } from "../../../../core/hooks/wallets/useSendToken.js";
import {
  defaultTokens,
  type SupportedTokens,
} from "../../../../core/utils/defaultTokens.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Input, Label } from "../../components/formElements.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { TokenIcon } from "../../components/TokenIcon.js";
import { Text } from "../../components/text.js";
import { StyledDiv } from "../../design-system/elements.js";
import type { ConnectLocale } from "../locale/types.js";
import { formatTokenBalance } from "./formatTokenBalance.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "./nativeToken.js";
import { TokenSelector } from "./TokenSelector.js";

type TXError = Error & { data?: { message?: string } };

/**
 * @internal
 */
export function SendFunds(props: {
  supportedTokens?: SupportedTokens;
  onBack: () => void;
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
}) {
  const [screen, setScreen] = useState<"base" | "tokenSelector">("base");
  const activeChain = useActiveWalletChain();
  const chainId = activeChain?.id;
  const { connectLocale, client } = props;

  let defaultToken: ERC20OrNativeToken = NATIVE_TOKEN;
  const supportedTokens = props.supportedTokens || defaultTokens;
  if (
    // if we know chainId
    chainId &&
    // if there is a list of tokens for this chain
    supportedTokens[chainId] &&
    // if the list of tokens is not the default list
    supportedTokens[chainId] !== defaultTokens[chainId]
  ) {
    // use the first token in the list as default selected
    const tokensForChain = supportedTokens[chainId];
    const firstToken = tokensForChain?.[0];
    if (firstToken) {
      defaultToken = firstToken;
    }
  }

  const [token, setToken] = useState<ERC20OrNativeToken>(defaultToken);

  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("0");

  const chain = useActiveWalletChain();

  const tokenList = (chain?.id ? supportedTokens[chain.id] : undefined) || [];

  if (screen === "tokenSelector" && chain) {
    return (
      <TokenSelector
        chain={chain}
        client={client}
        connectLocale={connectLocale}
        onBack={() => {
          setScreen("base");
        }}
        onTokenSelect={(_token) => {
          setToken(_token);
          setScreen("base");
        }}
        tokenList={tokenList}
      />
    );
  }

  return (
    <SendFundsForm
      amount={amount}
      client={client}
      connectLocale={connectLocale}
      onBack={props.onBack}
      onTokenSelect={() => {
        setScreen("tokenSelector");
      }}
      receiverAddress={receiverAddress}
      setAmount={setAmount}
      setReceiverAddress={setReceiverAddress}
      token={token}
    />
  );
}

/**
 * @internal Exported for tests
 */
export function SendFundsForm(props: {
  onTokenSelect: () => void;
  token: ERC20OrNativeToken;
  receiverAddress: string;
  setReceiverAddress: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  onBack: () => void;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
}) {
  const locale = props.connectLocale.sendFundsScreen;
  const tokenAddress =
    props.token && "address" in props.token ? props.token.address : undefined;

  const chain = useActiveWalletChain();
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();

  const balanceQuery = useWalletBalance({
    address: activeAccount?.address,
    chain,
    client: props.client,
    tokenAddress: tokenAddress,
  });

  const { receiverAddress, setReceiverAddress, amount, setAmount } = props;
  const sendTokenMutation = useSendToken(props.client);

  function getErrorMessage(error?: TXError) {
    const message = error?.data?.message || error?.message;

    if (!message) {
      return locale.transactionFailed;
    }

    if (
      message.includes("user rejected") ||
      message.includes("user closed modal") ||
      message.includes("user denied")
    ) {
      return locale.transactionRejected;
    }

    if (message.includes("insufficient funds")) {
      return locale.insufficientFunds;
    }

    return message;
  }

  const tokenId = useId();
  const receiverId = useId();
  const amountId = useId();

  if (!activeChain) {
    return null; // this should never happen
  }

  if (sendTokenMutation.isError) {
    return (
      <Container animate="fadein" p="lg">
        <ModalHeader
          onBack={() => {
            sendTokenMutation.reset();
          }}
          title={locale.title}
        />
        <Spacer y="xl" />
        <Container
          animate="fadein"
          center="both"
          color="danger"
          flex="column"
          gap="lg"
          style={{
            minHeight: "200px",
          }}
        >
          <CrossCircledIcon height={iconSize.xl} width={iconSize.xl} />
          <Text center color="danger" multiline>
            {getErrorMessage(sendTokenMutation.error)}
          </Text>
        </Container>
      </Container>
    );
  }

  if (sendTokenMutation.isSuccess) {
    return (
      <Container animate="fadein" p="lg">
        <ModalHeader
          onBack={() => {
            sendTokenMutation.reset();
          }}
          title={locale.title}
        />
        <Container
          animate="fadein"
          center="both"
          color="success"
          flex="column"
          gap="lg"
          style={{
            minHeight: "250px",
          }}
        >
          <CheckCircledIcon height={iconSize.xl} width={iconSize.xl} />
          <Text color="success"> {locale.successMessage} </Text>
        </Container>
      </Container>
    );
  }

  const tokenName =
    (props.token && "name" in props.token ? props.token.name : undefined) ||
    balanceQuery?.data?.name;

  const tokenSymbol =
    (props.token && "symbol" in props.token ? props.token.symbol : undefined) ||
    balanceQuery?.data?.symbol;

  return (
    <Container animate="fadein" p="lg">
      <ModalHeader onBack={props.onBack} title={locale.title} />
      <Spacer y="xl" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* Token  */}
        <Label color="secondaryText" htmlFor={tokenId}>
          {locale.token}
        </Label>
        <Spacer y="sm" />
        <Button
          fullWidth
          id={tokenId}
          onClick={props.onTokenSelect}
          style={{
            gap: spacing.sm,
            justifyContent: "flex-start",
            padding: spacing.sm,
          }}
          variant="outline"
        >
          <TokenIcon
            chain={activeChain}
            client={props.client}
            size="lg"
            token={props.token}
          />

          <Container flex="column" gap="xs">
            {tokenName ? (
              <Text color="primaryText" size="sm">
                {tokenName}
              </Text>
            ) : (
              <Skeleton height={fontSize.xs} width="150px" />
            )}

            {balanceQuery.data ? (
              <Text size="xs">{formatTokenBalance(balanceQuery.data)}</Text>
            ) : (
              <Skeleton height={fontSize.xs} width="100px" />
            )}
          </Container>
        </Button>

        <Spacer y="lg" />

        {/* Send to  */}
        <Label color="secondaryText" htmlFor={receiverId}>
          {locale.sendTo}
        </Label>
        <Spacer y="sm" />
        <Input
          id={receiverId}
          onChange={(e) => {
            setReceiverAddress(e.target.value);
          }}
          placeholder="0x... or ENS name"
          required
          value={receiverAddress}
          variant="outline"
        />

        <Spacer y="lg" />

        {/* Amount  */}
        <Label color="secondaryText" htmlFor={amountId}>
          {locale.amount}
        </Label>
        <Spacer y="sm" />
        <Container relative>
          <Input
            id={amountId}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            required
            type="number"
            value={amount}
            variant="outline"
          />
          <CurrencyBadge>
            <Text size="xs"> {tokenSymbol} </Text>
          </CurrencyBadge>
        </Container>

        <Spacer y="xxl" />

        {/* Submit */}
        <Button
          className="tw-sendfunds-screen-send-button"
          fullWidth
          onClick={async () => {
            if (!receiverAddress || !amount) {
              return;
            }

            await sendTokenMutation.mutateAsync({
              amount,
              receiverAddress,
              tokenAddress: tokenAddress,
            });
          }}
          style={{
            alignItems: "center",
            gap: spacing.sm,
            padding: spacing.md,
          }}
          type="submit"
          variant="accent"
        >
          {sendTokenMutation.isPending && (
            <Spinner color="accentButtonText" size="sm" />
          )}
          {sendTokenMutation.isPending ? locale.sending : locale.submitButton}
        </Button>
      </form>
    </Container>
  );
}

const CurrencyBadge = /* @__PURE__ */ StyledDiv({
  position: "absolute",
  right: spacing.sm,
  top: "50%",
  transform: "translateY(-50%)",
});
