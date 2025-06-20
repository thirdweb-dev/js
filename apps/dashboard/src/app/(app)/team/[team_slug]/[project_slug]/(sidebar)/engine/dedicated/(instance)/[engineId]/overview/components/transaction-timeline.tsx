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
  Stepper,
  StepSeparator,
  StepStatus,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { CheckIcon } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { Button, FormLabel, Text } from "tw-components";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";

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
  client,
}: {
  transaction: Transaction;
  instanceUrl: string;
  client: ThirdwebClient;
  authToken: string;
}) => {
  let timeline: TimelineStep[];
  switch (transaction?.status) {
    case "queued":
      // Queued: [ queued, _sent, _mined ]
      timeline = [
        {
          cta: (
            <CancelTransactionButton
              authToken={authToken}
              client={client}
              instanceUrl={instanceUrl}
              transaction={transaction}
            />
          ),
          date: transaction.queuedAt,
          isLatest: true,
          step: "Queued",
        },
        { step: "Sent" },
        { step: "Mined" },
      ];
      break;
    case "sent":
      // Sent: [ queued, sent, _mined ]
      timeline = [
        { date: transaction.queuedAt, step: "Queued" },
        {
          cta: (
            <CancelTransactionButton
              authToken={authToken}
              client={client}
              instanceUrl={instanceUrl}
              transaction={transaction}
            />
          ),
          date: transaction.sentAt,
          isLatest: true,
          step: "Sent",
        },
        { step: "Mined" },
      ];
      break;
    case "mined":
      // Mined: [ queued, sent, mined ]
      timeline = [
        { date: transaction.queuedAt, step: "Queued" },
        { date: transaction.sentAt, step: "Sent" },
        { date: transaction.minedAt, isLatest: true, step: "Mined" },
      ];
      break;
    case "cancelled":
      // Mined: [ queued, sent, cancelled, _mined ]
      timeline = [
        { date: transaction.queuedAt, step: "Queued" },
        { date: transaction.sentAt, step: "Sent" },
        { date: transaction.cancelledAt, isLatest: true, step: "Cancelled" },
        { step: "Mined" },
      ];
      break;
    case "errored":
      if (transaction.sentAt) {
        // Errored with sentAt: [ queued, sent, errored, _mined ]
        timeline = [
          { date: transaction.queuedAt, step: "Queued" },
          { date: transaction.sentAt, step: "Sent" },
          { isLatest: true, step: "Failed" },
          { step: "Mined" },
        ];
      } else {
        // Errored without sentAt: [ queued, errored, _sent, _mined ]
        timeline = [
          { date: transaction.queuedAt, step: "Queued" },
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
      gap="0"
      height={12 * timeline.length}
      index={activeIdx}
      orientation="vertical"
      size="xs"
    >
      {timeline.map((step, index) => {
        const isFilled = index <= activeIdx;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
          <Step as={Flex} key={index} w="full">
            <StepIndicator>
              <StepStatus
                active={<CheckIcon className="size-4" />}
                complete={<CheckIcon className="size-4" />}
              />
            </StepIndicator>
            <Flex justify="space-between" mt={-1} w="full">
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
  client,
}: {
  transaction: Transaction;
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const cancelTransactionMutation = useMutation({
    mutationFn: async () => {
      const resp = await fetch(`${instanceUrl}transaction/cancel`, {
        body: JSON.stringify({ queueId: transaction.queueId }),
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "x-backend-wallet-address": transaction.fromAddress ?? "",
        },
        method: "POST",
      });

      if (!resp.ok) {
        const json = await resp.json();
        throw json.error?.message;
      }
    },
  });

  const cancelTransactions = async () => {
    const promise = cancelTransactionMutation.mutateAsync();
    toast.promise(promise, {
      error: "Failed to cancel transaction",
      success: "Transaction cancelled successfully",
    });

    promise.then(() => {
      onClose();
    });
  };

  return (
    <>
      {/* @ts-expect-error - this works fine */}
      <Modal initialFocusRef={closeButtonRef} isOpen={isOpen} onClose={onClose}>
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
                  client={client}
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
              onClick={onClose}
              ref={closeButtonRef}
              type="button"
              variant="ghost"
            >
              Close
            </Button>
            <Button
              colorScheme="red"
              isLoading={cancelTransactionMutation.isPending}
              onClick={cancelTransactions}
            >
              Cancel transaction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Button colorScheme="red" onClick={onOpen} size="xs" variant="outline">
        Cancel transaction
      </Button>
    </>
  );
};
