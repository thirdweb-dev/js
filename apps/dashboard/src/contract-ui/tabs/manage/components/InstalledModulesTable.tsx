"use client";

import { WalletAddress } from "@/components/blocks/wallet-address";
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
  getContract,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import { uninstallModuleByProxy } from "thirdweb/modules";
import type { Account } from "thirdweb/wallets";
import { useModuleContractInfo } from "./moduleContractInfo";

export const InstalledModulesTable = (props: {
  contract: ContractOptions;
  installedModules: {
    data?: string[];
    isPending: boolean;
  };
  refetchModules: () => void;
  ownerAccount?: Account;
}) => {
  const { installedModules, ownerAccount } = props;

  const sectionTitle = (
    <h2 className="mb-3 font-bold text-2xl tracking-tight">
      Installed Modules
    </h2>
  );

  if (!installedModules.isPending && installedModules.data?.length === 0) {
    return (
      <>
        {sectionTitle}
        <Alert variant="destructive">
          <div className="flex items-center gap-3">
            <CircleSlash className="size-6 text-red-400" />
            <AlertTitle className="mb-0">No modules installed</AlertTitle>
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
              <TableHeading> Module Name </TableHeading>
              <TableHeading> Description </TableHeading>
              <TableHeading> Publisher Address </TableHeading>
              <TableHeading> Module Address </TableHeading>
              <TableHeading> Version </TableHeading>
              {ownerAccount && <TableHeading> Remove </TableHeading>}
            </TableHeadingRow>
          </thead>

          <tbody>
            {installedModules.isPending ? (
              <>
                <SkeletonRow ownerAccount={ownerAccount} />
                <SkeletonRow ownerAccount={ownerAccount} />
                <SkeletonRow ownerAccount={ownerAccount} />
              </>
            ) : (
              <>
                {installedModules.data?.map((e, i) => (
                  <ModuleRow
                    // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                    key={i}
                    moduleAddress={e}
                    contract={props.contract}
                    onRemoveModule={props.refetchModules}
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

function ModuleRow(props: {
  moduleAddress: string;
  contract: ContractOptions;
  onRemoveModule: () => void;
  ownerAccount?: Account;
}) {
  const { contract, moduleAddress, ownerAccount } = props;
  const [isUninstallModalOpen, setIsUninstallModalOpen] = useState(false);

  const contractInfo = useModuleContractInfo(
    getContract({
      address: moduleAddress,
      chain: contract.chain,
      client: contract.client,
    }),
  );

  const uninstallMutation = useMutation({
    mutationFn: async (account: Account) => {
      const uninstallTransaction = uninstallModuleByProxy({
        contract,
        chain: contract.chain,
        client: contract.client,
        moduleProxyAddress: moduleAddress,
        moduleData: "0x",
      });

      const txResult = await sendTransaction({
        transaction: uninstallTransaction,
        account,
      });

      await waitForReceipt(txResult);
    },
    onSuccess() {
      toast.success("Module Removed successfully");
      props.onRemoveModule();
    },
    onError(error) {
      toast.error("Failed to remove module");
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
        <WalletAddress address={contractInfo.publisher || ""} />
      </TableData>
      <TableData>
        <CopyAddressButton
          className="text-xs"
          address={moduleAddress || ""}
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
            <ToolTipLabel label="Remove Module">
              <Button
                onClick={() => setIsUninstallModalOpen(true)}
                variant="outline"
                className="rounded-xl p-3 text-red-500"
              >
                {uninstallMutation.isPending ? (
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
        <DialogContent className="z-[10001]" dialogOverlayClassName="z-[10000]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRemove();
            }}
          >
            <DialogHeader>
              <DialogTitle>Uninstall Module</DialogTitle>
              <DialogDescription>
                Are you sure you want to uninstall{" "}
                <span className="font-medium text-foreground ">
                  {contractInfo.name}
                </span>{" "}
                ?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-10 flex-row justify-end gap-3 md:gap-1">
              <Button
                type="button"
                onClick={() => setIsUninstallModalOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>

              <TransactionButton
                transactionCount={1}
                isLoading={uninstallMutation.isPending}
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
    <tr className="border-border border-b [&:last-child]:border-b-0">
      {props.children}
    </tr>
  );
}

function TableData({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-4 text-sm">{children}</td>;
}

function TableHeading(props: { children: React.ReactNode }) {
  return (
    <th className="min-w-[150px] border-border border-b px-3 py-3 text-left font-medium text-muted-foreground text-sm">
      {props.children}
    </th>
  );
}

function TableHeadingRow({ children }: { children: React.ReactNode }) {
  return <tr className="relative bg-muted/50">{children}</tr>;
}
