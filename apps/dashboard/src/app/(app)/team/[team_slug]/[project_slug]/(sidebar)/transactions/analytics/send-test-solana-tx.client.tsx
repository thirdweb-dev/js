"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLinkIcon, Loader2Icon, LockIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import * as z from "zod";
import { engineCloudProxy } from "@/actions/proxies";
import type { Project } from "@/api/project/projects";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { TryItOut } from "../server-wallets/components/try-it-out";
import type { SolanaWallet } from "../solana-wallets/wallet-table/types";

const formSchema = z.object({
  secretKey: z.string().min(1, "Secret key is required"),
  walletIndex: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

function SendTestSolanaTransactionModal(props: {
  wallets?: SolanaWallet[];
  project: Project;
  teamSlug: string;
  walletId?: string;
  isManagedVault: boolean;
  client: ThirdwebClient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    defaultValues: {
      secretKey: "",
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

  const selectedWalletIndex = Number.parseInt(form.watch("walletIndex"));
  const selectedWallet = props.wallets?.[selectedWalletIndex];

  const sendDummySolanaTxMutation = useMutation({
    mutationFn: async (args: { walletAddress: string; secretKey: string }) => {
      const response = await engineCloudProxy({
        body: JSON.stringify({
          executionOptions: {
            chainId: "solana:devnet",
            signerAddress: args.walletAddress,
            maxBlockhashRetries: 0,
            commitment: "confirmed",
          },
          instructions: [
            {
              programId: "11111111111111111111111111111111", // System Program
              accounts: [
                {
                  pubkey: args.walletAddress,
                  isSigner: true,
                  isWritable: true,
                },
                {
                  pubkey: args.walletAddress,
                  isSigner: false,
                  isWritable: true,
                },
              ],
              data: "AgAAAAAAAAAAAAAAAA==", // Transfer 0 SOL (base64)
              encoding: "base64",
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
        pathname: "/v1/solana/transaction",
      });

      if (!response.ok) {
        const errorMsg = response.error ?? "Failed to send Solana transaction";
        throw new Error(errorMsg);
      }

      return response.data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Test Solana transaction sent successfully!");
      // Close the modal after successful transaction
      setTimeout(() => {
        props.onOpenChange(false);
      }, 1000);
    },
  });

  const isLoading = sendDummySolanaTxMutation.isPending;

  // Early return in render phase
  if (!props.wallets || props.wallets.length === 0 || !selectedWallet) {
    return null;
  }

  const onSubmit = async (data: FormValues) => {
    await sendDummySolanaTxMutation.mutateAsync({
      secretKey: data.secretKey,
      walletAddress: selectedWallet.publicKey,
    });
    queryClient.invalidateQueries({
      queryKey: ["solana-transactions", props.project.id],
    });
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Send Test Solana Transaction</DialogTitle>
        <DialogDescription>
          Test your Solana server wallet by sending a 0 SOL transfer transaction
          on Solana Devnet
        </DialogDescription>
      </DialogHeader>

      {/* Funding Alert */}
      <Alert>
        <AlertDescription className="flex flex-col gap-2">
          <p className="font-medium">⚠️ Fund your wallet first</p>
          <p className="text-sm">
            Your Solana wallet needs SOL on Devnet to pay for transaction fees.
            Get free Devnet SOL from the Solana faucet:
          </p>
          <Link
            href="https://faucet.solana.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-link-foreground hover:underline text-sm"
          >
            <ExternalLinkIcon className="size-4" />
            https://faucet.solana.com/
          </Link>
        </AlertDescription>
      </Alert>

      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4">
          {/* Wallet Selector */}
          <div className="flex flex-col gap-2">
            <p className="text-sm">Select Wallet</p>
            <Select
              disabled={props.wallets.length === 1}
              value={form.watch("walletIndex")}
              onValueChange={(value) => form.setValue("walletIndex", value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {props.wallets.map((wallet, index) => (
                  <SelectItem
                    key={wallet.id}
                    value={index.toString()}
                    className="font-mono"
                  >
                    {wallet.metadata.label || `Wallet ${index + 1}`} (
                    {wallet.publicKey.slice(0, 6)}...
                    {wallet.publicKey.slice(-4)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Wallet Address Display */}
          <div className="flex flex-col gap-2">
            <p className="text-sm">Public Key</p>
            <code className="text-xs font-mono bg-muted p-2 rounded break-all">
              {selectedWallet.publicKey}
            </code>
          </div>

          {/* Network Info */}
          <div className="flex flex-col gap-2">
            <p className="text-sm">Network</p>
            <div className="flex items-center gap-2 bg-muted p-2 rounded">
              <div className="size-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
              <span className="text-sm">Solana Devnet</span>
            </div>
          </div>

          {/* Secret Key Input */}
          <div className="flex flex-col gap-2">
            <p className="text-sm">
              {props.isManagedVault ? "Secret Key" : "Vault Access Token"}
            </p>
            <div className="relative">
              <Input
                {...form.register("secretKey")}
                className="pr-10 font-mono"
                placeholder={
                  props.isManagedVault
                    ? "Enter your secret key"
                    : "Enter your vault access token"
                }
                type="password"
              />
              <LockIcon className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {form.formState.errors.secretKey && (
              <p className="text-destructive text-sm">
                {form.formState.errors.secretKey.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 md:flex-row md:justify-end md:gap-2">
            <Button
              className="w-full md:w-auto"
              onClick={() => props.onOpenChange(false)}
              variant="secondary"
              type="button"
            >
              Close
            </Button>
            <Button
              className="w-full min-w-[200px] md:w-auto"
              disabled={isLoading || !form.formState.isValid}
              type="submit"
              variant="primary"
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Transaction"
              )}
            </Button>
          </div>
        </div>
      </form>
    </DialogContent>
  );
}

export function SendTestSolanaTransaction(props: {
  wallets?: SolanaWallet[];
  project: Project;
  teamSlug: string;
  expanded?: boolean;
  walletId?: string;
  isManagedVault: boolean;
  client: ThirdwebClient;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useDashboardRouter();

  // Early return in render phase
  if (!props.wallets || props.wallets.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 w-full rounded-md border bg-background p-6">
      <TryItOut useEngineAPI={false} />
      <div className="mt-6 flex flex-col gap-2 md:flex-row md:justify-end md:gap-2">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="w-full md:w-auto">
              Test Request
            </Button>
          </DialogTrigger>
          <SendTestSolanaTransactionModal
            {...props}
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
          />
        </Dialog>
        <Button
          className="w-full md:w-auto"
          onClick={() => {
            if (props.walletId) {
              router.replace(
                `/team/${props.teamSlug}/${props.project.slug}/transactions`,
              );
            } else {
              localStorage.setItem("solanEngineFtuxCompleted", "true");
              router.refresh();
            }
          }}
          variant="primary"
        >
          {props.walletId ? "Close" : "Complete Setup"}
        </Button>
      </div>
    </div>
  );
}
