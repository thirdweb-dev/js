"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { Wallet } from "../server-wallets/wallet-table/types";
import { SmartAccountCell } from "../server-wallets/wallet-table/wallet-table-ui.client";

const formSchema = z.object({
  secretKey: z.string().min(1, "Secret key is required"),
  chainId: z.number(),
  walletIndex: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function SendTestTransaction(props: {
  wallets?: Wallet[];
  project: Project;
  teamSlug: string;
  expanded?: boolean;
  walletId?: string;
  isManagedVault: boolean;
  client: ThirdwebClient;
}) {
  const queryClient = useQueryClient();
  const [hasSentTx, setHasSentTx] = useState(false);
  const router = useDashboardRouter();

  const chainsQuery = useAllChainsData();

  const form = useForm<FormValues>({
    defaultValues: {
      secretKey: "",
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
      secretKey: string;
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
          ...(props.isManagedVault
            ? { "x-secret-key": args.secretKey }
            : { "x-vault-access-token": args.secretKey }),
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
      secretKey: data.secretKey,
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
          Every server wallet action requires your{" "}
          {props.isManagedVault ? "project secret key" : "vault access token"}.
        </p>
        <div className="h-4" />
        {/* Responsive container */}
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-2">
          <div className="flex-grow">
            <div className="flex flex-col gap-2">
              <p className="text-sm">
                {props.isManagedVault
                  ? "Project Secret Key"
                  : "Vault Access Token"}
              </p>
              <Input
                placeholder={
                  props.isManagedVault
                    ? "Enter your project secret key"
                    : "Enter your vault access token"
                }
                type={"password"}
                {...form.register("secretKey")}
                className="text-xs"
                disabled={isLoading}
              />
              <p className="text-muted-foreground text-xs">
                {props.isManagedVault
                  ? "Your project secret key was generated when you created your project. If you lost it, you can regenerate one in the project settings."
                  : "Your vault access token was generated when you created your vault. If you lost it, you can regenerate one in the vault settings."}
              </p>
            </div>
          </div>
        </div>
        <div className="h-6" />
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
                    `/team/${props.teamSlug}/${props.project.slug}/transactions`,
                  );
                } else {
                  router.refresh();
                }
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
