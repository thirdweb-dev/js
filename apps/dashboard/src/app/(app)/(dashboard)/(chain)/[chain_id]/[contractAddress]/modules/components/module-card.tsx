"use client";

import * as Sentry from "@sentry/nextjs";
import { useMutation } from "@tanstack/react-query";
import { InfoIcon } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { toast } from "sonner";
import {
  getContract,
  type ThirdwebClient,
  type ThirdwebContract,
} from "thirdweb";
import { uninstallModuleByProxy } from "thirdweb/modules";
import type { Account } from "thirdweb/wallets";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { TransactionButton } from "@/components/tx-button";
import { Button } from "@/components/ui/button";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { useSendAndConfirmTx } from "@/hooks/useSendTx";
import { ModuleInstance } from "./module-instance";
import { useModuleContractInfo } from "./moduleContractInfo";

type ModuleCardProps = {
  moduleAddress: string;
  contract: ThirdwebContract;
  onRemoveModule: () => void;
  ownerAccount: Account | undefined;
  allModuleContractInfo: {
    name: string;
    description?: string;
    version?: string;
    publisher?: string;
  }[];
  isLoggedIn: boolean;
};

export function ModuleCard(props: ModuleCardProps) {
  const { contract, moduleAddress, ownerAccount } = props;
  const [isUninstallModalOpen, setIsUninstallModalOpen] = useState(false);
  const sendAndConfirmTx = useSendAndConfirmTx();

  const contractInfo = useModuleContractInfo(
    getContract({
      address: moduleAddress,
      chain: contract.chain,
      client: contract.client,
    }),
  );

  const uninstallMutation = useMutation({
    mutationFn: async () => {
      const uninstallTransaction = uninstallModuleByProxy({
        chain: contract.chain,
        client: contract.client,
        contract,
        moduleData: "0x",
        moduleProxyAddress: moduleAddress,
      });

      await sendAndConfirmTx.mutateAsync(uninstallTransaction);
    },
    onError(error) {
      toast.error("Failed to uninstall module");
      console.error(error);
    },
    onSuccess() {
      toast.success("Module uninstalled successfully");
      props.onRemoveModule();
    },
  });

  const handleRemove = async () => {
    uninstallMutation.mutate();
  };

  if (!contractInfo) {
    return <GenericModuleLoadingSkeleton />;
  }

  return (
    <>
      <Suspense fallback={<GenericModuleLoadingSkeleton />}>
        <ErrorBoundary
          FallbackComponent={(p) => (
            <ModuleErrorBoundary moduleName={contractInfo.name} {...p} />
          )}
        >
          <ModuleInstance
            allModuleContractInfo={props.allModuleContractInfo}
            contract={contract}
            contractInfo={{
              description: contractInfo.description,
              name: contractInfo.name,
              publisher: contractInfo.publisher,
              version: contractInfo.version,
            }}
            isLoggedIn={props.isLoggedIn}
            moduleAddress={moduleAddress}
            ownerAccount={ownerAccount}
            uninstallButton={{
              isPending: uninstallMutation.isPending,
              onClick: () => {
                setIsUninstallModalOpen(true);
              },
            }}
          />
        </ErrorBoundary>
      </Suspense>

      <Dialog
        onOpenChange={setIsUninstallModalOpen}
        open={isUninstallModalOpen}
      >
        <DialogContent>
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
                onClick={() => setIsUninstallModalOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>

              <TransactionButton
                className="flex"
                client={contract.client}
                isLoggedIn={props.isLoggedIn}
                isPending={uninstallMutation.isPending}
                transactionCount={1}
                txChainID={contract.chain.id}
                type="submit"
                variant="destructive"
              >
                Uninstall
              </TransactionButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export type ModuleCardUIProps = {
  children?: React.ReactNode;
  client: ThirdwebClient;
  contractInfo: {
    name: string;
    description?: string;
    version?: string;
    publisher?: string;
  };
  moduleAddress: string;
  isOwnerAccount: boolean;
  uninstallButton: {
    onClick: () => void;
    isPending: boolean;
  };
  updateButton?:
    | {
        onClick?: () => void;
        isPending: boolean;
        isDisabled: boolean;
      }
    | React.FC;
};

export function ModuleCardUI(props: ModuleCardUIProps) {
  return (
    <section className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="relative p-4 lg:p-6">
        {/* Title */}
        <div className="pr-14">
          <h3 className="mb-1 gap-2 font-semibold text-xl tracking-tight">
            {props.contractInfo.name}

            {/* Info Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="absolute top-4 right-4 h-auto w-auto p-2 text-muted-foreground"
                  variant="ghost"
                >
                  <InfoIcon className="size-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{props.contractInfo.name}</DialogTitle>
                  <DialogDescription>
                    {props.contractInfo.description}
                  </DialogDescription>

                  {/* Avoid adding focus on other elements to prevent tooltips from opening on modal open */}
                  <input aria-hidden className="sr-only" />

                  <div className="h-2" />

                  <div className="flex flex-col gap-4">
                    {props.contractInfo.version && (
                      <div>
                        <p className="text-muted-foreground text-sm">
                          {" "}
                          Version{" "}
                        </p>
                        <p> {props.contractInfo.version}</p>
                      </div>
                    )}

                    {props.contractInfo.publisher && (
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Published By
                        </p>
                        <WalletAddress
                          address={props.contractInfo.publisher}
                          client={props.client}
                        />
                      </div>
                    )}

                    <div>
                      <p className="mb-1 text-muted-foreground text-sm">
                        Module Address
                      </p>
                      <CopyAddressButton
                        address={props.moduleAddress}
                        className="text-xs"
                        copyIconPosition="left"
                        variant="outline"
                      />
                    </div>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </h3>

          {/* Description */}
          <p className="text-muted-foreground">
            {props.contractInfo.description}
          </p>
        </div>

        {props.children ? (
          <>
            <div className="h-5" />
            {props.children}
          </>
        ) : null}
      </div>

      <div className="flex flex-row justify-end gap-3 border-border border-t p-4 lg:p-6">
        <Button
          className="min-w-24 gap-2"
          disabled={!props.isOwnerAccount}
          onClick={props.uninstallButton.onClick}
          size="sm"
          variant="destructive"
        >
          {props.uninstallButton.isPending && <Spinner className="size-4" />}
          Uninstall
        </Button>

        {props.isOwnerAccount &&
          props.updateButton &&
          typeof props.updateButton !== "function" && (
            <Button
              className="min-w-24 gap-2"
              disabled={props.updateButton.isPending || !props.isOwnerAccount}
              onClick={props.updateButton.onClick}
              size="sm"
              type="submit"
            >
              {props.updateButton.isPending && <Spinner className="size-4" />}
              Update
            </Button>
          )}

        {props.isOwnerAccount && typeof props.updateButton === "function" && (
          <props.updateButton />
        )}
      </div>
    </section>
  );
}

function GenericModuleLoadingSkeleton() {
  return <Skeleton className="h-[190px] w-full border border-border" />;
}

function ModuleErrorBoundary(
  props: FallbackProps & {
    moduleName: string;
  },
) {
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    Sentry.withScope((scope) => {
      scope.setTag("component-crashed", "true");
      scope.setTag("component-crashed-boundary", "ModuleErrorBoundary");
      scope.setLevel("fatal");
      Sentry.captureException(props.error);
    });
  }, [props.error]);

  return (
    <div className="flex h-[190px] w-full items-center justify-center border border-border">
      Failed to render {props.moduleName} module
    </div>
  );
}
