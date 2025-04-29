"use client";
import { engineCloudProxy } from "@/actions/proxies";
import type { Project } from "@/api/projects";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { WalletAvatar } from "@/components/blocks/wallet-address";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, LockIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { shortenAddress } from "thirdweb/utils";
import * as z from "zod";
import type { Wallet } from "../server-wallets/wallet-table/types";

const formSchema = z.object({
  accessToken: z.string().min(1, "Access token is required"),
  walletIndex: z.string(),
  chainId: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

export function SendTestTransaction(props: {
  wallets?: Wallet[];
  project: Project;
  expanded?: boolean;
}) {
  const thirdwebClient = useThirdwebClient();
  const queryClient = useQueryClient();
  const [hasSentTx, setHasSentTx] = useState(false);
  const router = useDashboardRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessToken: "",
      walletIndex: "0",
      chainId: 84532,
    },
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
        pathname: "/write/transaction",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-team-id": props.project.teamId,
          "x-client-id": props.project.publishableKey,
          "x-vault-access-token": args.accessToken,
        },
        body: JSON.stringify({
          executionOptions: {
            type: "AA",
            signerAddress: args.walletAddress,
            chainId: args.chainId.toString(),
          },
          params: [
            {
              to: args.walletAddress,
              value: "0",
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorMsg = response.error ?? "Failed to send transaction";
        throw new Error(errorMsg);
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success("Test transaction sent successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isLoading = sendDummyTxMutation.isPending;

  // Early return in render phase
  if (!props.wallets || props.wallets.length === 0 || !selectedWallet) {
    return null;
  }

  const onSubmit = async (data: FormValues) => {
    await sendDummyTxMutation.mutateAsync({
      walletAddress: selectedWallet.address,
      accessToken: data.accessToken,
      chainId: data.chainId,
    });
    queryClient.invalidateQueries({
      queryKey: ["transactions", props.project.id],
    });
    setHasSentTx(true);
  };

  return (
    <div className="mt-3 w-full rounded-md border bg-background p-6">
      <p className="font-medium text-foreground text-sm">
        Engine is designed to scale, gas-free, fast, and secure. <br />
      </p>
      <div className="h-2" />
      <p className="text-muted-foreground text-sm">
        Fire up many test transactions and watch the table below to see how it
        performs!
      </p>
      <div className="h-4" />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <p className="flex items-center gap-2 text-sm text-warning-text">
          <LockIcon className="h-4 w-4" /> This action requires your vault
          access token.
        </p>
        <div className="h-4" />
        {/* Responsive container */}
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-2">
          <div className="flex-grow">
            <div className="flex flex-col gap-2">
              <p className="text-sm">Vault Access Token</p>
              <Input
                id="access-token"
                type="password"
                placeholder="vt_act_1234....ABCD"
                {...form.register("accessToken")}
                disabled={isLoading}
                className="text-xs"
              />
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
                value={form.watch("walletIndex")}
                onValueChange={(value) => form.setValue("walletIndex", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <WalletAvatar
                        address={selectedWallet.address}
                        profiles={[]}
                        thirdwebClient={thirdwebClient}
                        iconClassName="h-5 w-5"
                      />
                      <span className="font-mono text-sm">
                        {shortenAddress(selectedWallet.address)}
                      </span>
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
                        <WalletAvatar
                          address={wallet.address}
                          profiles={[]}
                          thirdwebClient={thirdwebClient}
                          iconClassName="h-5 w-5"
                        />
                        <span className="font-mono text-sm">
                          {shortenAddress(wallet.address)}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {selectedWallet.metadata.label}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-sm">Network</p>
              <SingleNetworkSelector
                className="bg-background"
                client={thirdwebClient}
                chainId={form.watch("chainId")}
                onChange={(chainId) => {
                  form.setValue("chainId", chainId);
                }}
              />
            </div>
          </div>
        </div>
        <div className="h-6" />
        <div className="flex flex-col gap-2 md:flex-row md:justify-end md:gap-2">
          {hasSentTx && (
            <Button
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => {
                router.refresh();
              }}
            >
              Complete Setup
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || !form.formState.isValid}
            className="w-full min-w-[200px] md:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>{hasSentTx ? "Send More Transactions" : "Send Transaction"}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
