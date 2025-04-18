"use client";
import { WalletAvatar } from "@/components/blocks/wallet-address";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CodeClient } from "@/components/ui/code/code.client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { THIRDWEB_ENGINE_CLOUD_URL } from "@/constants/env";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { shortenAddress } from "thirdweb/utils";
import { useDashboardRouter } from "../../../../../../../@/lib/DashboardRouter";
import type { Wallet } from "../wallet-table/types";

export default function SendDummyTx(props: {
  authToken: string;
  wallet: Wallet;
  team_slug: string;
  project_slug: string;
}) {
  const router = useDashboardRouter();
  const thirdwebClient = useThirdwebClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [projectSecretKey, setProjectSecretKey] = useState("");
  const sendDummyTxMutation = useMutation({
    mutationFn: async (args: {
      walletAddress: string;
      accessToken: string;
    }) => {
      const response = await fetch(
        `${THIRDWEB_ENGINE_CLOUD_URL}/write/contract`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-secret-key": projectSecretKey,
          },
          body: JSON.stringify({
            executionOptions: {
              type: "AA",
              signerAddress: args.walletAddress,
            },
            transactionParams: [
              {
                contractAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
                method: "approve",
                params: [args.walletAddress, "0"],
              },
            ],
            vaultAccessToken: args.accessToken,
            chainId: "84532",
          }),
        },
      );
      return response.json();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const isLoading = sendDummyTxMutation.isPending;

  return (
    <>
      <Button
        variant={"primary"}
        onClick={() => {
          setModalOpen(true);
          sendDummyTxMutation.reset();
        }}
        disabled={isLoading}
        className="flex flex-row items-center gap-2"
      >
        {isLoading && <Loader2 className="animate-spin" />}
        Send Test Transaction
      </Button>

      <Dialog open={modalOpen} onOpenChange={handleCloseModal} modal={true}>
        <DialogContent className="overflow-hidden p-0">
          <DialogHeader className="p-6">
            <DialogTitle>Send Test Transaction</DialogTitle>
          </DialogHeader>
          {sendDummyTxMutation.isPending ? (
            <div className="flex flex-col items-center justify-center gap-4 p-10">
              <Spinner className="size-8" />
              <p className="text-muted-foreground text-sm">
                Sending transaction...
              </p>
            </div>
          ) : sendDummyTxMutation.data ? (
            <div>
              <div className="space-y-6 p-6 pt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-medium text-sm">
                      Transaction Result
                    </h3>
                    <div className="flex flex-col gap-2 ">
                      <CodeClient
                        lang="json"
                        className="max-h-[350px] max-w-[470px] overflow-auto bg-background"
                        code={JSON.stringify(sendDummyTxMutation.data, null, 2)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t bg-card px-6 py-4">
                <Button
                  onClick={() => {
                    handleCloseModal();
                    router.push(
                      `/team/${props.team_slug}/${props.project_slug}/transactions`,
                    );
                  }}
                  variant={"primary"}
                >
                  View in Analytics
                </Button>
              </div>
            </div>
          ) : (
            <div className="px-6 pb-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start gap-2">
                  <h3 className="mb-2 font-medium text-md">Sending from</h3>
                  <div className="flex flex-row items-center gap-2">
                    <WalletAvatar
                      address={props.wallet.address}
                      profiles={[]}
                      thirdwebClient={thirdwebClient}
                    />
                    <span className="cursor-pointer font-mono text-sm">
                      {shortenAddress(props.wallet.address)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-warning-text">
                  This action requries a project secret key and a Vault access
                  token.
                </p>
                <Input
                  type="password"
                  placeholder="Enter your project secret key"
                  value={projectSecretKey}
                  onChange={(e) => setProjectSecretKey(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Enter your Vault access token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setAccessToken("");
                      setModalOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={"primary"}
                    onClick={() =>
                      sendDummyTxMutation.mutate({
                        walletAddress: props.wallet.address,
                        accessToken,
                      })
                    }
                    disabled={!accessToken || sendDummyTxMutation.isPending}
                  >
                    {sendDummyTxMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Transaction"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
