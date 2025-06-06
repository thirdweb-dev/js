import { CheckIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Hex } from "viem";
import type { WaitForReceiptOptions } from "../../../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import { formatExplorerTxUrl } from "../../../../utils/url.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { iconSize } from "../../../core/design-system/index.js";
import { useChainExplorers } from "../../../core/hooks/others/useChainQuery.js";
import { useSendTransaction } from "../../hooks/transaction/useSendTransaction.js";
import { AccentFailIcon } from "../ConnectWallet/icons/AccentFailIcon.js";
import { Spacer } from "../components/Spacer.js";
import { Spinner } from "../components/Spinner.js";
import { Container, ModalHeader } from "../components/basic.js";
import { Button, ButtonLink } from "../components/buttons.js";
import { Text } from "../components/text.js";

export function ExecutingTxScreen(props: {
  tx: PreparedTransaction;
  closeModal: () => void;
  onTxSent: (data: WaitForReceiptOptions) => void;
  onBack?: () => void;
}) {
  const sendTxCore = useSendTransaction({
    payModal: false,
  });
  const [txHash, setTxHash] = useState<Hex | undefined>();
  const [txError, setTxError] = useState<Error | undefined>();
  const chainExplorers = useChainExplorers(props.tx.chain);
  const [status, setStatus] = useState<"loading" | "failed" | "sent">(
    "loading",
  );
  const theme = useCustomTheme();

  const sendTx = useCallback(async () => {
    setStatus("loading");
    setTxError(undefined);
    try {
      const txData = await sendTxCore.mutateAsync(props.tx);
      setTxHash(txData.transactionHash);
      props.onTxSent(txData);
      setStatus("sent");
    } catch (e) {
      // Do not reject the transaction here, because the user may want to try again
      // we only reject on modal close
      console.error(e);
      setTxError(e as Error);
      setStatus("failed");
    }
  }, [sendTxCore, props.tx, props.onTxSent]);

  const done = useRef(false);
  useEffect(() => {
    if (done.current) {
      return;
    }

    done.current = true;
    sendTx();
  }, [sendTx]);

  return (
    <Container p="lg">
      <ModalHeader title="Transaction" onBack={props.onBack} />

      <Spacer y="xxl" />

      <Container flex="row" center="x">
        {status === "loading" && <Spinner size="xxl" color="accentText" />}
        {status === "failed" && <AccentFailIcon size={iconSize["3xl"]} />}
        {status === "sent" && (
          <Container
            center="both"
            flex="row"
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: theme.colors.tertiaryBg,
              marginBottom: "16px",
              border: `2px solid ${theme.colors.success}`,
              animation: "successBounce 0.6s ease-out",
            }}
          >
            <CheckIcon
              width={iconSize.xl}
              height={iconSize.xl}
              color={theme.colors.success}
              style={{
                animation: "checkAppear 0.3s ease-out 0.3s both",
              }}
            />
          </Container>
        )}
      </Container>

      <Spacer y="lg" />

      <Text color="primaryText" center size="lg">
        {status === "loading" && "Sending transaction"}
        {status === "failed" && "Transaction failed"}
        {status === "sent" && "Transaction sent"}
      </Text>
      <Spacer y="sm" />
      <Text color="danger" center size="sm">
        {status === "failed" && txError ? txError.message || "" : ""}
      </Text>

      <Spacer y="xl" />

      {status === "failed" && (
        <Button variant="accent" fullWidth onClick={sendTx}>
          Try Again
        </Button>
      )}

      {status === "sent" && (
        <>
          {txHash && (
            <>
              <ButtonLink
                fullWidth
                variant="outline"
                href={formatExplorerTxUrl(
                  chainExplorers.explorers[0]?.url ?? "",
                  txHash,
                )}
                target="_blank"
                as="a"
                gap="xs"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                View on Explorer
                <ExternalLinkIcon width={iconSize.sm} height={iconSize.sm} />
              </ButtonLink>
              <Spacer y="sm" />
            </>
          )}
          <Button variant="accent" fullWidth onClick={props.closeModal}>
            Done
          </Button>
        </>
      )}
    </Container>
  );
}
