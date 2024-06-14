import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { isAddress } from "../../../../../utils/address.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../../core/design-system/index.js";
import { useWalletBalance } from "../../../../core/hooks/others/useWalletBalance.js";
import { useActiveAccount } from "../../../hooks/wallets/useActiveAccount.js";
import { useActiveWalletChain } from "../../../hooks/wallets/useActiveWalletChain.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { TokenIcon } from "../../components/TokenIcon.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Input, Label } from "../../components/formElements.js";
import { Text } from "../../components/text.js";
import { StyledDiv } from "../../design-system/elements.js";
import { useSendToken } from "../../hooks/useSendToken.js";
import { type SupportedTokens, defaultTokens } from "../defaultTokens.js";
import type { ConnectLocale } from "../locale/types.js";
import { TokenSelector } from "./TokenSelector.js";
import { formatTokenBalance } from "./formatTokenBalance.js";
import { type ERC20OrNativeToken, NATIVE_TOKEN } from "./nativeToken.js";

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
        tokenList={tokenList}
        onBack={() => {
          setScreen("base");
        }}
        onTokenSelect={(_token) => {
          setToken(_token);
          setScreen("base");
        }}
        chain={chain}
        connectLocale={connectLocale}
        client={client}
      />
    );
  }

  return (
    <SendFundsForm
      token={token}
      onTokenSelect={() => {
        setScreen("tokenSelector");
      }}
      receiverAddress={receiverAddress}
      setReceiverAddress={setReceiverAddress}
      amount={amount}
      setAmount={setAmount}
      onBack={props.onBack}
      client={client}
      connectLocale={connectLocale}
    />
  );
}

/**
 * @internal
 */
function SendFundsForm(props: {
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
    chain,
    tokenAddress: tokenAddress,
    address: activeAccount?.address,
    client: props.client,
  });

  const { receiverAddress, setReceiverAddress, amount, setAmount } = props;

  // Ethereum or Rinkeby or Goerli
  // TODO support ens
  const isENSSupported = false;

  const isValidReceiverAddress = useMemo(() => {
    const isENS = receiverAddress.endsWith(".eth");

    if (!isENSSupported && isENS) {
      return false;
    }

    return isENS || isAddress(receiverAddress);
  }, [receiverAddress]);

  const showInvalidAddressError = receiverAddress && !isValidReceiverAddress;

  const sendTokenMutation = useSendToken(props.client);

  function getErrorMessage(error?: TXError) {
    const message = error?.data?.message || error?.message;

    if (!message) {
      return locale.transactionFailed;
    }

    if (message.includes("user rejected")) {
      return locale.transactionRejected;
    }

    if (message.includes("insufficient funds")) {
      return locale.insufficientFunds;
    }

    return locale.transactionFailed;
  }

  if (!activeChain) {
    return null; // this should never happen
  }

  if (sendTokenMutation.isError) {
    return (
      <Container p="lg" animate="fadein">
        <ModalHeader
          title={locale.title}
          onBack={() => {
            sendTokenMutation.reset();
          }}
        />
        <Spacer y="xl" />
        <Container
          flex="column"
          gap="lg"
          animate="fadein"
          center="both"
          style={{
            minHeight: "200px",
          }}
          color="danger"
        >
          <CrossCircledIcon width={iconSize.xl} height={iconSize.xl} />
          <Text color="danger">{getErrorMessage(sendTokenMutation.error)}</Text>
        </Container>
      </Container>
    );
  }

  if (sendTokenMutation.isSuccess) {
    return (
      <Container p="lg" animate="fadein">
        <ModalHeader
          title={locale.title}
          onBack={() => {
            sendTokenMutation.reset();
          }}
        />
        <Container
          flex="column"
          gap="lg"
          animate="fadein"
          center="both"
          style={{
            minHeight: "250px",
          }}
          color="success"
        >
          <CheckCircledIcon width={iconSize.xl} height={iconSize.xl} />
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
    <Container p="lg" animate="fadein">
      <ModalHeader title={locale.title} onBack={props.onBack} />
      <Spacer y="xl" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* Token  */}
        <Label htmlFor="token" color="secondaryText">
          {locale.token}
        </Label>
        <Spacer y="sm" />
        <Button
          id="token"
          variant="outline"
          fullWidth
          style={{
            justifyContent: "flex-start",
            gap: spacing.sm,
            padding: spacing.sm,
          }}
          onClick={props.onTokenSelect}
        >
          <TokenIcon
            token={props.token}
            chain={activeChain}
            size="lg"
            client={props.client}
          />

          <Container flex="column" gap="xs">
            {tokenName ? (
              <Text size="sm" color="primaryText">
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
        <Label htmlFor="receiver" color="secondaryText">
          {locale.sendTo}
        </Label>
        <Spacer y="sm" />
        <Input
          data-error={showInvalidAddressError}
          required
          id="receiver"
          placeholder={isENSSupported ? "0x... / ENS name" : "0x..."}
          variant="outline"
          value={receiverAddress}
          onChange={(e) => {
            setReceiverAddress(e.target.value);
          }}
        />

        {showInvalidAddressError && (
          <>
            <Spacer y="xs" />
            <Text color="danger" size="sm">
              {locale.invalidAddress}
            </Text>
          </>
        )}

        <Spacer y="lg" />

        {/* Amount  */}
        <Label htmlFor="amount" color="secondaryText">
          {locale.amount}
        </Label>
        <Spacer y="sm" />
        <Container relative>
          <Input
            required
            type="number"
            id="amount"
            variant="outline"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
          <CurrencyBadge>
            <Text size="xs"> {tokenSymbol} </Text>
          </CurrencyBadge>
        </Container>

        <Spacer y="xxl" />

        {/* Submit */}
        <Button
          fullWidth
          variant="accent"
          type="submit"
          onClick={async () => {
            if (!receiverAddress || !amount) {
              return;
            }

            await sendTokenMutation.mutateAsync({
              receiverAddress,
              amount,
              tokenAddress: tokenAddress,
            });
          }}
          style={{
            alignItems: "center",
            gap: spacing.sm,
            padding: spacing.md,
          }}
        >
          {sendTokenMutation.isPending ? locale.sending : locale.submitButton}
          {sendTokenMutation.isPending && (
            <Spinner size="sm" color="accentButtonText" />
          )}
        </Button>
      </form>
    </Container>
  );
}

const CurrencyBadge = /* @__PURE__ */ StyledDiv({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  right: spacing.sm,
});
