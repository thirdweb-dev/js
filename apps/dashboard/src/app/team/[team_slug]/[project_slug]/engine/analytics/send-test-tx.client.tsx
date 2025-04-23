"use client";
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
import { THIRDWEB_ENGINE_CLOUD_URL } from "@/constants/env";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Loader2, LockIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { shortenAddress } from "thirdweb/utils";
import * as z from "zod";
import type { Wallet } from "../server-wallets/wallet-table/types";

const formSchema = z.object({
  projectSecretKey: z.string().min(1, "Project secret key is required"),
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
  const [isOpen, setIsOpen] = useState(props.expanded ?? false);
  const thirdwebClient = useThirdwebClient();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectSecretKey: "",
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
      const response = await fetch(
        `${THIRDWEB_ENGINE_CLOUD_URL}/write/transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-secret-key": form.getValues("projectSecretKey"),
          },
          body: JSON.stringify({
            executionOptions: {
              type: "AA",
              signerAddress: args.walletAddress,
            },
            transactionParams: [
              {
                to: args.walletAddress,
                value: "0",
              },
            ],
            vaultAccessToken: args.accessToken,
            chainId: args.chainId.toString(),
          }),
        },
      );
      const result = await response.json();
      if (!response.ok) {
        const errorMsg = result?.error?.message || "Failed to send transaction";
        throw new Error(errorMsg);
      }
      return result;
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
  };

  return (
    <div className="w-full space-y-2 rounded-md border bg-card p-3">
      {/* Trigger Area */}
      <div
        role="button"
        tabIndex={0}
        className="flex cursor-pointer items-center justify-between p-3"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsOpen(!isOpen);
          }
        }}
      >
        <h2 className="font-semibold text-xl tracking-tight">
          Send Test Transaction
        </h2>
        <ChevronDown
          className={`h-4 w-4 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Content Area (conditional) */}
      {isOpen && (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-3 pb-3"
        >
          <p className="flex items-center gap-2 text-sm text-warning-text">
            <LockIcon className="h-4 w-4" /> This action requires a project
            secret key and a vault access token.
          </p>
          {/* Responsive container */}
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-2">
            <div className="flex-grow">
              <div className="flex flex-col gap-2">
                <p className="text-sm">Project Secret Key</p>
                <Input
                  id="secret-key"
                  type="password"
                  placeholder="abcd....1234"
                  {...form.register("projectSecretKey")}
                  disabled={isLoading}
                  className="text-xs"
                />
              </div>
            </div>
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
          {/* Wallet Selector */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-2">
              <div className="flex flex-1 flex-col gap-2">
                <p className="text-sm">Signer</p>
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
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !form.formState.isValid}
              size="sm"
              className="w-full min-w-[200px] md:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Transaction"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
