"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAllChainsData } from "hooks/chains/allChains";
import { Loader2Icon, LockIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import * as z from "zod";
import { engineCloudProxy } from "@/actions/proxies";
import type { Project } from "@/api/projects";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { Wallet } from "../server-wallets/wallet-table/types";
import { SmartAccountCell } from "../server-wallets/wallet-table/wallet-table-ui.client";
import { deleteUserAccessToken, getUserAccessToken } from "./utils";

const formSchema = z.object({
  accessToken: z.string().min(1, "Access token is required"),
  chainId: z.number(),
  walletIndex: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function SendTestTransaction(props: {
  wallets?: Wallet[];
  project: Project;
  teamSlug: string;
  userAccessToken?: string;
  expanded?: boolean;
  walletId?: string;
  client: ThirdwebClient;
}) {
  const queryClient = useQueryClient();
  const [hasSentTx, setHasSentTx] = useState(false);
  const router = useDashboardRouter();

  const chainsQuery = useAllChainsData();

  const userAccessToken =
    props.userAccessToken ?? getUserAccessToken(props.project.id) ?? "";

  const form = useForm<FormValues>({
    defaultValues: {
      accessToken: userAccessToken,
      chainId: 84532,
      walletIndex:
        props.wallets && props.walletId
          ? props.wallets
              .findIndex((w) => w.id === props.walletId)
              ?.toString()
              .replace("-1", "0")
          : "0",
    },
    resolver: zodResolver(formSchema),
  });

  const selectedWalletIndex = Number(form.watch("walletIndex"));
  const selectedWallet = props.wallets?.[selectedWalletIndex];

  const sendDummyTxMutation = useMutation({
    mutationFn: async (args: {
      walletAddress: string;
      accessToken: string;
      chainId: number;
    }) => {
      const response = await engineCloudProxy({
        body: JSON.stringify({
          executionOptions: {
            chainId: args.chainId.toString(),
            from: args.walletAddress,
          },
          params: [
            {
              to: args.walletAddress,
              value: "0",
            },
          ],
        }),
        headers: {
          "Content-Type": "application/json",
          "x-client-id": props.project.publishableKey,
          "x-team-id": props.project.teamId,
          "x-vault-access-token": args.accessToken,
        },
        method: "POST",
        pathname: "/v1/write/transaction",
      });

      if (!response.ok) {
        const errorMsg = response.error ?? "Failed to send transaction";
        throw new Error(errorMsg);
      }

      return response.data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Test transaction sent successfully!");
    },
  });

  const isLoading = sendDummyTxMutation.isPending;

  // Early return in render phase
  if (!props.wallets || props.wallets.length === 0 || !selectedWallet) {
    return null;
  }

  const onSubmit = async (data: FormValues) => {
    await sendDummyTxMutation.mutateAsync({
      accessToken: data.accessToken,
      chainId: data.chainId,
      walletAddress: selectedWallet.address,
    });
    queryClient.invalidateQueries({
      queryKey: ["transactions", props.project.id],
    });
    setHasSentTx(true);
  };

  return (
    <div className="mt-3 w-full rounded-md border bg-background p-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {props.walletId && (
          <h3 className="mb-4 font-medium text-lg">Send a test transaction</h3>
        )}
        <p className="flex items-center gap-2 text-sm text-warning-text">
          <LockIcon className="h-4 w-4" />
          {userAccessToken
            ? "Copy your Vault access token, you'll need it for every HTTP call to Engine."
            : "Every wallet action requires your Vault access token."}
        </p>
        <div className="h-4" />
        {/* Responsive container */}
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-2">
          <div className="flex-grow">
            <div className="flex flex-col gap-2">
              <p className="text-sm">Vault Access Token</p>
              {userAccessToken ? (
                <div className="flex flex-col gap-2 ">
                  <CopyTextButton
                    className="!h-auto w-full justify-between bg-background px-3 py-3 font-mono text-xs"
                    copyIconPosition="right"
                    textToCopy={userAccessToken}
                    textToShow={userAccessToken}
                    tooltip="Copy Vault Access Token"
                  />
                  <p className="text-muted-foreground text-xs">
                    This is a project-wide access token to access your server
                    wallets. You can create more access tokens using your admin
                    key, with granular scopes and permissions.
                  </p>
                </div>
              ) : (
                <Input
                  placeholder="vt_act_1234....ABCD"
                  type={userAccessToken ? "text" : "password"}
                  {...form.register("accessToken")}
                  className="text-xs"
                  disabled={isLoading}
                />
              )}
            </div>
          </div>
        </div>
        <div className="h-4" />
        {/* Wallet Selector */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-2">
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-sm">Server Wallet</p>
              <Select
                onValueChange={(value) => form.setValue("walletIndex", value)}
                value={form.watch("walletIndex")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <SmartAccountCell
                        client={props.client}
                        wallet={selectedWallet}
                      />
                      <span className="text-muted-foreground text-sm">
                        {selectedWallet.metadata.label}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {props.wallets.map((wallet, index) => (
                    <SelectItem key={wallet.address} value={index.toString()}>
                      <div className="flex items-center gap-2">
                        <SmartAccountCell
                          client={props.client}
                          wallet={wallet}
                        />
                        <span className="text-muted-foreground text-sm">
                          {wallet.metadata.label}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-sm">Select Testnet</p>
              <SingleNetworkSelector
                chainId={form.watch("chainId")}
                chainIds={chainsQuery.allChains
                  .filter(
                    (chain) =>
                      chain.testnet === true &&
                      chain.stackType !== "zksync_stack",
                  )
                  .map((chain) => chain.chainId)}
                className="bg-background"
                client={props.client}
                onChange={(chainId) => {
                  form.setValue("chainId", chainId);
                }}
              />
            </div>
          </div>
        </div>
        <div className="h-6" />
        <div className="flex flex-col gap-2 md:flex-row md:justify-end md:gap-2">
          <Button
            className="w-full min-w-[200px] md:w-auto"
            disabled={isLoading || !form.formState.isValid}
            type="submit"
            variant={hasSentTx ? "secondary" : "primary"}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : hasSentTx ? (
              "Send More Transactions"
            ) : (
              "Send Transaction"
            )}
          </Button>
          {hasSentTx && (
            <Button
              className="w-full md:w-auto"
              onClick={() => {
                if (props.walletId) {
                  router.replace(
                    `/team/${props.teamSlug}/${props.project.slug}/engine/cloud`,
                  );
                } else {
                  router.refresh();
                }
                // clear token from local storage after FTUX is complete
                deleteUserAccessToken(props.project.id);
              }}
              variant="primary"
            >
              {props.walletId ? "Close" : "Complete Setup"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
