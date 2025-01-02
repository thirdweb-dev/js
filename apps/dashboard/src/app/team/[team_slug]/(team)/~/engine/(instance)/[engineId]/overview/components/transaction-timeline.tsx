import { WalletAddress } from "@/components/blocks/wallet-address";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import type { Transaction } from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  FormControl,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Step,
  StepIndicator,
  StepSeparator,
  StepStatus,
  Stepper,
  useDisclosure,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useTxNotifications } from "hooks/useTxNotifications";
import { CheckIcon } from "lucide-react";
import { useRef } from "react";
import { Button, FormLabel, Text } from "tw-components";

interface TimelineStep {
  step: string;
  isLatest?: boolean;
  date?: string | null;
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  cta?: any;
}

export const TransactionTimeline = ({
  transaction,
  instanceUrl,
  authToken,
}: {
  transaction: Transaction;
  instanceUrl: string;
  authToken: string;
}) => {
  let timeline: TimelineStep[];
  switch (transaction?.status) {
    case "queued":
      // Queued: [ queued, _sent, _mined ]
      timeline = [
        {
          isLatest: true,
          step: "Queued",
          date: transaction.queuedAt,
          cta: (
            <CancelTransactionButton
              transaction={transaction}
              instanceUrl={instanceUrl}
              authToken={authToken}
            />
          ),
        },
        { step: "Sent" },
        { step: "Mined" },
      ];
      break;
    case "sent":
      // Sent: [ queued, sent, _mined ]
      timeline = [
        { step: "Queued", date: transaction.queuedAt },
        {
          isLatest: true,
          step: "Sent",
          date: transaction.sentAt,
          cta: (
            <CancelTransactionButton
              transaction={transaction}
              instanceUrl={instanceUrl}
              authToken={authToken}
            />
          ),
        },
        { step: "Mined" },
      ];
      break;
    case "mined":
      // Mined: [ queued, sent, mined ]
      timeline = [
        { step: "Queued", date: transaction.queuedAt },
        { step: "Sent", date: transaction.sentAt },
        { isLatest: true, step: "Mined", date: transaction.minedAt },
      ];
      break;
    case "cancelled":
      // Mined: [ queued, sent, cancelled, _mined ]
      timeline = [
        { step: "Queued", date: transaction.queuedAt },
        { step: "Sent", date: transaction.sentAt },
        { isLatest: true, step: "Cancelled", date: transaction.cancelledAt },
        { step: "Mined" },
      ];
      break;
    case "errored":
      if (transaction.sentAt) {
        // Errored with sentAt: [ queued, sent, errored, _mined ]
        timeline = [
          { step: "Queued", date: transaction.queuedAt },
          { step: "Sent", date: transaction.sentAt },
          { isLatest: true, step: "Failed" },
          { step: "Mined" },
        ];
      } else {
        // Errored without sentAt: [ queued, errored, _sent, _mined ]
        timeline = [
          { step: "Queued", date: transaction.queuedAt },
          { isLatest: true, step: "Failed" },
          { step: "Sent" },
          { step: "Mined" },
        ];
      }
      break;
    default:
      return null;
  }

  const activeIdx = timeline.findIndex((s) => !!s.isLatest);

  return (
    <Stepper
      index={activeIdx}
      orientation="vertical"
      height={12 * timeline.length}
      gap="0"
      size="xs"
    >
      {timeline.map((step, index) => {
        const isFilled = index <= activeIdx;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
          <Step key={index} as={Flex} w="full">
            <StepIndicator>
              <StepStatus
                complete={<CheckIcon className="size-4" />}
                active={<CheckIcon className="size-4" />}
              />
            </StepIndicator>
            <Flex justify="space-between" w="full" mt={-1}>
              <div className="flex flex-col gap-2">
                {isFilled ? (
                  <Text>{step.step}</Text>
                ) : (
                  <Text color="gray.600">{step.step}</Text>
                )}
                {step.cta}
              </div>
              {step.date && (
                <Text fontSize="small">
                  {prettyPrintTimestamp(step.date, index === 0)}
                </Text>
              )}
            </Flex>
            <StepSeparator />
          </Step>
        );
      })}
    </Stepper>
  );
};

const prettyPrintTimestamp = (
  t: string | undefined,
  showDate = false,
): string | null => {
  if (!t) {
    return null;
  }

  const date = new Date(t);
  return showDate
    ? date.toLocaleString(undefined, { timeZoneName: "short" })
    : date.toLocaleTimeString(undefined, { timeZoneName: "short" });
};

const CancelTransactionButton = ({
  transaction,
  instanceUrl,
  authToken,
}: {
  transaction: Transaction;
  instanceUrl: string;
  authToken: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully sent a request to cancel the transaction",
    "Failed to cancel transaction",
  );
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const onClickContinue = async () => {
    try {
      const resp = await fetch(`${instanceUrl}transaction/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          "x-backend-wallet-address": transaction.fromAddress ?? "",
        },
        body: JSON.stringify({ queueId: transaction.queueId }),
      });
      if (!resp.ok) {
        const json = await resp.json();
        throw json.error?.message;
      }
      onSuccess();
    } catch (e) {
      console.error("Cancelling transaction:", e);
      onError(e);
    }

    onClose();
  };

  return (
    <>
      {/* @ts-expect-error - this works fine */}
      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={closeButtonRef}>
        <ModalOverlay />
        <ModalContent className="!bg-background rounded-lg border border-border">
          <ModalHeader>Cancel Transaction</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Text>Are you sure you want to cancel this transaction?</Text>
              <FormControl>
                <FormLabel>Queue ID</FormLabel>
                <Text fontFamily="mono">{transaction.queueId}</Text>
              </FormControl>
              <FormControl>
                <FormLabel>Submitted at</FormLabel>
                <Text>
                  {format(new Date(transaction.queuedAt ?? ""), "PP pp z")}
                </Text>
              </FormControl>
              <FormControl>
                <FormLabel>From</FormLabel>
                <WalletAddress
                  address={transaction.fromAddress ?? ""}
                  shortenAddress={false}
                />
              </FormControl>
              <FormControl>
                <FormLabel>To</FormLabel>
                <CopyAddressButton
                  address={transaction.toAddress ?? ""}
                  copyIconPosition="right"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Function</FormLabel>
                <Text fontFamily="mono">{transaction.functionName}</Text>
              </FormControl>

              <Text>
                If this transaction is already submitted, it may complete before
                the cancellation is submitted.
              </Text>
            </div>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              variant="ghost"
            >
              Close
            </Button>
            <Button type="submit" colorScheme="red" onClick={onClickContinue}>
              Cancel transaction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Button onClick={onOpen} variant="outline" size="xs" colorScheme="red">
        Cancel transaction
      </Button>
    </>
  );
};
