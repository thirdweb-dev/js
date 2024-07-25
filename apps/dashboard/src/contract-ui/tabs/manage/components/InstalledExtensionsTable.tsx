"use client";

import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import { CircleSlash } from "lucide-react";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "sonner";
import {
  type ContractOptions,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import { uninstallExtensionByProxy } from "thirdweb/extensions/modular";
import type { Account } from "thirdweb/wallets";
import { useExtensionContractInfo } from "./extensionContractInfo";

export const InstalledExtensionsTable = (props: {
  contract: ContractOptions;
  installedExtensions: {
    data?: string[];
    isLoading: boolean;
  };
  refetchExtensions: () => void;
  ownerAccount?: Account;
}) => {
  const { installedExtensions, ownerAccount } = props;

  const sectionTitle = (
    <h2 className="mb-3 text-2xl tracking-tight font-bold">
      Installed Extensions
    </h2>
  );

  if (
    !installedExtensions.isLoading &&
    installedExtensions.data?.length === 0
  ) {
    return (
      <>
        {sectionTitle}
        <Alert variant="destructive">
          <div className="flex gap-3 items-center">
            <CircleSlash className="size-6 text-red-400" />
            <AlertTitle className="mb-0">No extensions installed</AlertTitle>
          </div>
        </Alert>
      </>
    );
  }

  return (
    <>
      {sectionTitle}
      <ScrollShadow scrollableClassName="rounded-lg">
        <table className="w-full selection:bg-inverted selection:text-inverted-foreground">
          <thead>
            <TableHeadingRow>
              <TableHeading> Extension Name </TableHeading>
              <TableHeading> Description </TableHeading>
              <TableHeading> Publisher Address </TableHeading>
              <TableHeading> Extension Address </TableHeading>
              <TableHeading> Version </TableHeading>
              {ownerAccount && <TableHeading> Remove </TableHeading>}
            </TableHeadingRow>
          </thead>

          <tbody>
            {installedExtensions.isLoading ? (
              <>
                <SkeletonRow ownerAccount={ownerAccount} />
                <SkeletonRow ownerAccount={ownerAccount} />
                <SkeletonRow ownerAccount={ownerAccount} />
              </>
            ) : (
              <>
                {installedExtensions.data?.map((e, i) => (
                  <ExtensionRow
                    // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                    key={i}
                    extensionAddress={e}
                    contract={props.contract}
                    onRemoveExtension={props.refetchExtensions}
                    ownerAccount={ownerAccount}
                  />
                ))}
              </>
            )}
          </tbody>
        </table>
      </ScrollShadow>
    </>
  );
};

function SkeletonRow(props: { ownerAccount?: Account }) {
  return (
    <TableRow>
      <TableData>
        <Skeleton className="h-6" />
      </TableData>
      <TableData>
        <Skeleton className="h-6" />
      </TableData>
      <TableData>
        <Skeleton className="h-6" />
      </TableData>
      <TableData>
        <Skeleton className="h-6" />
      </TableData>

      {/* Version */}
      <TableData>
        <Skeleton className="h-6" />
      </TableData>

      {/* Remove */}
      {props.ownerAccount && (
        <TableData>
          <Skeleton className="h-6" />
        </TableData>
      )}
    </TableRow>
  );
}

function ExtensionRow(props: {
  extensionAddress: string;
  contract: ContractOptions;
  onRemoveExtension: () => void;
  ownerAccount?: Account;
}) {
  const { contract, extensionAddress, ownerAccount } = props;
  const [isUninstallModalOpen, setIsUninstallModalOpen] = useState(false);

  const contractInfo = useExtensionContractInfo(props.extensionAddress);

  const uninstallMutation = useMutation({
    mutationFn: async (account: Account) => {
      const uninstallTransaction = uninstallExtensionByProxy({
        contract,
        chain: contract.chain,
        client: contract.client,
        extensionProxyAddress: extensionAddress,
        extensionData: "0x",
      });

      const txResult = await sendTransaction({
        transaction: uninstallTransaction,
        account,
      });

      await waitForReceipt(txResult);
    },
    onSuccess() {
      toast.success("Extension Removed successfully");
      props.onRemoveExtension();
    },
    onError(error) {
      toast.error("Failed to remove extension");
      console.error("Error during uninstallation:", error);
    },
  });

  const handleRemove = async () => {
    if (!ownerAccount) {
      return;
    }

    setIsUninstallModalOpen(false);
    uninstallMutation.mutate(ownerAccount);
  };

  if (!contractInfo) {
    return <SkeletonRow ownerAccount={ownerAccount} />;
  }

  return (
    <TableRow>
      <TableData>
        <p>{contractInfo.name}</p>
      </TableData>
      <TableData>
        <p>{contractInfo.description || "..."}</p>
      </TableData>
      <TableData>
        <CopyAddressButton
          className="text-xs"
          address={contractInfo.publisher || ""}
          copyIconPosition="left"
          variant="outline"
        />
      </TableData>
      <TableData>
        <CopyAddressButton
          className="text-xs"
          address={extensionAddress || ""}
          copyIconPosition="left"
          variant="outline"
        />
      </TableData>

      {/* Version */}
      <TableData>
        <p>{contractInfo.version}</p>
      </TableData>

      {/* Remove */}
      {ownerAccount && (
        <TableData>
          <div>
            <ToolTipLabel label="Remove Extension">
              <Button
                onClick={() => setIsUninstallModalOpen(true)}
                variant="outline"
                className="text-red-500 rounded-xl p-3"
              >
                {uninstallMutation.isLoading ? (
                  <Spinner className="size-4" />
                ) : (
                  <FaRegTrashAlt className="size-4" />
                )}
              </Button>
            </ToolTipLabel>
          </div>
        </TableData>
      )}

      <Dialog
        open={isUninstallModalOpen}
        onOpenChange={setIsUninstallModalOpen}
      >
        <DialogContent className="border-border max-w-[calc(100vw-20px)] md:max-w-[450px] rounded-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRemove();
            }}
          >
            <DialogHeader className="text-xl tracking-tight font-semibold text-left mb-3">
              <DialogTitle>Uninstall Extension</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Are you sure you want to uninstall{" "}
              <span className="text-foreground font-medium ">
                {contractInfo.name}
              </span>{" "}
              ?
            </DialogDescription>

            <DialogFooter className="mt-10 gap-3 md:gap-1 flex-row justify-end">
              <Button
                type="button"
                onClick={() => setIsUninstallModalOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>

              <TransactionButton
                transactionCount={1}
                isLoading={uninstallMutation.isLoading}
                type="submit"
                colorScheme="red"
                className="flex"
              >
                Uninstall
              </TransactionButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TableRow>
  );
}

function TableRow(props: { children: React.ReactNode }) {
  return (
    <tr className="border-b border-border [&:last-child]:border-b-0">
      {props.children}
    </tr>
  );
}

function TableData({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-4 text-sm">{children}</td>;
}

function TableHeading(props: { children: React.ReactNode }) {
  return (
    <th className="border-b border-border text-left px-3 py-3 text-sm font-medium text-muted-foreground min-w-[150px]">
      {props.children}
    </th>
  );
}

function TableHeadingRow({ children }: { children: React.ReactNode }) {
  return <tr className="relative bg-secondary">{children}</tr>;
}
