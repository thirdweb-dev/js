"use client";

import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useResolveContractAbi } from "@3rdweb-sdk/react/hooks/useResolveContractAbi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SourcesPanel } from "components/contract-components/shared/sources-panel";
import { useContractSources } from "contract-ui/hooks/useContractSources";
import {
  CircleCheckIcon,
  CircleXIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";

type VerificationResult = {
  explorerUrl: string;
  success: boolean;
  alreadyVerified: boolean;
  error?: string;
};

export async function verifyContract(contract: ThirdwebContract) {
  try {
    const response = await fetch(
      "https://contract.thirdweb.com/verify/contract",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractAddress: contract.address,
          chainId: contract.chain.id,
        }),
      },
    );

    if (!response.ok) {
      console.error(`Error verifying contract: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error verifying contract: ${error}`);
  }
}

function VerifyContractModalContent({
  contract,
}: {
  contract: ThirdwebContract;
}) {
  const verifyQuery = useQuery({
    queryKey: ["verify-contract", contract.chain.id, contract.address],
    queryFn: () => verifyContract(contract),
  });

  return (
    <div className="flex flex-col p-6">
      {verifyQuery.isPending && (
        <div className="flex min-h-24 items-center justify-center">
          <div className="flex items-center gap-2">
            <Spinner className="size-4" />
            <p className="font-medium text-sm">Verifying</p>
          </div>
        </div>
      )}

      {verifyQuery?.error ? (
        <div className="flex min-h-24 items-center justify-center">
          <div className="flex items-center gap-2">
            <CircleXIcon className="size-4 text-red-600" />
            <p className="font-medium text-sm">
              {verifyQuery?.error.toString()}
            </p>
          </div>
        </div>
      ) : null}

      {verifyQuery.data?.results ? (
        <div className="flex flex-col gap-2">
          {verifyQuery.data.results.map(
            (result: VerificationResult, index: number) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <div key={index} className="flex items-center gap-2">
                {result.success && (
                  <>
                    <CircleCheckIcon className="size-4 text-green-600" />
                    {result.alreadyVerified && (
                      <p className="font-medium text-sm">
                        {result.explorerUrl}: Already verified
                      </p>
                    )}
                    {!result.alreadyVerified && (
                      <p className="font-medium text-sm">
                        {result.explorerUrl}: Verification successful
                      </p>
                    )}
                  </>
                )}

                {!result.success && (
                  <>
                    <CircleXIcon className="size-4 text-red-600" />
                    <p className="font-medium text-sm">
                      {`${result.explorerUrl}: Verification failed`}
                    </p>
                  </>
                )}
              </div>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}

export function ContractSourcesPage({
  contract,
}: { contract: ThirdwebContract }) {
  const contractSourcesQuery = useContractSources(contract);
  const abiQuery = useResolveContractAbi(contract);

  // clean up the source filenames and filter out libraries
  const sources = useMemo(() => {
    if (!contractSourcesQuery.data) {
      return [];
    }
    return contractSourcesQuery.data
      .map((source) => {
        return {
          ...source,
          filename: source.filename.split("/").pop(),
        };
      })
      .slice()
      .reverse();
  }, [contractSourcesQuery.data]);

  if (!contractSourcesQuery || contractSourcesQuery.isPending) {
    return <GenericLoadingPage />;
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-semibold text-2xl tracking-tight">Sources</h2>
          <p className="text-muted-foreground text-sm">
            View ABI and source code for the contract
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RefreshContractMetadataButton
            chainId={contract.chain.id}
            contractAddress={contract.address}
          />

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2" size="sm">
                <ShieldCheckIcon className="size-4" />
                Verify contract
              </Button>
            </DialogTrigger>
            <DialogContent className="gap-0 overflow-hidden p-0">
              <DialogHeader className="border-b p-6">
                <DialogTitle>Verify Contract</DialogTitle>
              </DialogHeader>
              <VerifyContractModalContent contract={contract} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="h-4" />
      <div className="rounded-lg border bg-card">
        <SourcesPanel sources={sources} abi={abiQuery.data} />
      </div>
    </div>
  );
}

function RefreshContractMetadataButton(props: {
  chainId: number;
  contractAddress: string;
}) {
  const router = useDashboardRouter();
  const queryClient = useQueryClient();
  const contractCacheMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `https://contract.thirdweb.com/metadata/${props.chainId}/${props.contractAddress}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        const errorMsg = await response.json();
        console.error(`Failed to purge contract cache: ${response.statusText}`);

        throw new Error(
          errorMsg.message ||
            errorMsg.error ||
            "Failed to refresh contract data.",
        );
      }
      // successful response
      return true;
    },
    onSuccess: async () => {
      // invalidate _all_ queries
      await queryClient.invalidateQueries();
      // refresh the page
      setTimeout(() => {
        router.refresh();
      }, 1000);
    },
  });

  return (
    <Button
      disabled={contractCacheMutation.isPending}
      variant="outline"
      onClick={() => {
        toast.promise(contractCacheMutation.mutateAsync(), {
          duration: 5000,
          success: () => "Contract refreshed successfully",
          error: (e) => e?.message || "Failed to refresh contract data.",
        });
      }}
      size="sm"
      className="gap-2 bg-card"
    >
      {contractCacheMutation.isPending ? (
        <Spinner className="size-4" />
      ) : (
        <RefreshCcwIcon className="size-4" />
      )}
      Refresh Contract <span className="max-sm:hidden"> Data </span>
    </Button>
  );
}
