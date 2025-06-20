import { CheckIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Hex } from "viem";
import type { WaitForReceiptOptions } from "../../../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import { formatExplorerTxUrl } from "../../../../utils/url.js";
import type { WindowAdapter } from "../../../core/adapters/WindowAdapter.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { iconSize } from "../../../core/design-system/index.js";
import { useChainExplorers } from "../../../core/hooks/others/useChainQuery.js";
import { useSendTransaction } from "../../hooks/transaction/useSendTransaction.js";
import { AccentFailIcon } from "../ConnectWallet/icons/AccentFailIcon.js";
import { Container, ModalHeader } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Spacer } from "../components/Spacer.js";
import { Spinner } from "../components/Spinner.js";
import { Text } from "../components/text.js";

export function ExecutingTxScreen(props: {
  tx: PreparedTransaction;
  closeModal: () => void;
  onTxSent: (data: WaitForReceiptOptions) => void;
  onBack?: () => void;
  windowAdapter: WindowAdapter;
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
      <ModalHeader onBack={props.onBack} title="Transaction" />

      <Spacer y="xxl" />

      <Container center="x" flex="row">
        {status === "loading" && <Spinner color="accentText" size="xxl" />}
        {status === "failed" && <AccentFailIcon size={iconSize["3xl"]} />}
        {status === "sent" && (
          <Container
            center="both"
            flex="row"
            style={{
              animation: "successBounce 0.6s ease-out",
              backgroundColor: theme.colors.tertiaryBg,
              border: `2px solid ${theme.colors.success}`,
              borderRadius: "50%",
              height: "64px",
              marginBottom: "16px",
              width: "64px",
            }}
          >
            <CheckIcon
              color={theme.colors.success}
              height={iconSize.xl}
              style={{
                animation: "checkAppear 0.3s ease-out 0.3s both",
              }}
              width={iconSize.xl}
            />
          </Container>
        )}
      </Container>

      <Spacer y="md" />

      <Text center color="primaryText" size="lg">
        {status === "loading" && "Sending transaction"}
        {status === "failed" && "Transaction failed"}
        {status === "sent" && "Transaction sent"}
      </Text>
      <Spacer y="sm" />
      <Text center color="danger" size="sm">
        {status === "failed" && txError ? txError.message || "" : ""}
      </Text>

      <Spacer y="xl" />

      {status === "failed" && (
        <Button fullWidth onClick={sendTx} variant="accent">
          Try Again
        </Button>
      )}

      {status === "sent" && (
        <>
          {txHash && (
            <>
              <Button
                color="primaryText"
                fullWidth
                gap="xs"
                onClick={() => {
                  props.windowAdapter.open(
                    formatExplorerTxUrl(
                      chainExplorers.explorers[0]?.url ?? "",
                      txHash,
                    ),
                  );
                }}
                variant="secondary"
              >
                View on Explorer
                <ExternalLinkIcon height={iconSize.sm} width={iconSize.sm} />
              </Button>
              <Spacer y="sm" />
            </>
          )}
          <Button fullWidth onClick={props.closeModal} variant="accent">
            Done
          </Button>
        </>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes successBounce {
            0% {
              transform: scale(0.3);
              opacity: 0;
            }
            50% {
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes checkAppear {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </Container>
  );
}
