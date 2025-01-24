"use client";

import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import {
  useAddContractMutation,
  useAllContractList,
} from "@3rdweb-sdk/react/hooks/useRegistry";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChainSlug } from "hooks/chains/chainSlug";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getAddress, isAddress } from "thirdweb";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { z } from "zod";

type ImportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ImportModal: React.FC<ImportModalProps> = (props) => {
  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(v) => {
        if (!v) {
          props.onClose();
        }
      }}
    >
      <DialogContent
        dialogOverlayClassName="z-[9000] rounded-lg"
        className="z-[9001]"
      >
        <DialogHeader>
          <DialogTitle className="font-semibold text-2xl tracking-tight">
            Import Contract
          </DialogTitle>
          <DialogDescription>
            Import an already deployed contract into thirdweb by entering a
            contract address below.
          </DialogDescription>
        </DialogHeader>

        <ImportForm />
      </DialogContent>
    </Dialog>
  );
};

const importFormSchema = z.object({
  contractAddress: z.string().refine(
    (v) => {
      try {
        return isAddress(v);
      } catch {
        return false;
      }
    },
    {
      message: "Invalid contract address",
    },
  ),
  chainId: z.coerce.number(),
});

function ImportForm() {
  const router = useDashboardRouter();
  const activeChainId = useActiveWalletChain()?.id;
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm({
    resolver: zodResolver(importFormSchema),
    values: {
      contractAddress: "",
      chainId: activeChainId || 1,
    },
  });
  const chainSlug = useChainSlug(form.watch("chainId"));
  const addToDashboard = useAddContractMutation();
  const address = useActiveAccount()?.address;
  const registry = useAllContractList(address);

  const showLoading =
    form.formState.isSubmitting ||
    addToDashboard.isPending ||
    addToDashboard.isSuccess ||
    isRedirecting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          const { chainId } = data;
          let contractAddress: string;

          try {
            contractAddress = getAddress(data.contractAddress);
          } catch {
            form.setError("contractAddress", {
              message: "Invalid contract address",
            });
            return;
          }

          try {
            const res = await fetch(
              `https://contract.thirdweb.com/metadata/${chainId}/${contractAddress}`,
            );
            const json = await res.json();

            if (json.error) {
              throw new Error(json.message);
            }

            const hasUnknownContractName =
              !!json.settings?.compilationTarget?.UnknownContract;

            const hasPartialAbi = json.metadata?.isPartialAbi;

            if (hasUnknownContractName || hasPartialAbi) {
              form.setError("contractAddress", {
                message:
                  "This contract cannot be imported since it's not verified on any block explorers.",
              });
              return;
            }

            const isInRegistry =
              registry.isFetched &&
              registry.data?.find(
                (c) =>
                  contractAddress &&
                  // compare address...
                  c.address.toLowerCase() === contractAddress.toLowerCase() &&
                  // ... and chainId
                  c.chainId === chainId,
              ) &&
              registry.isSuccess;

            if (isInRegistry) {
              router.push(`/${chainSlug}/${contractAddress}`);
              setIsRedirecting(true);
              return;
            }

            addToDashboard.mutate(
              {
                contractAddress,
                chainId,
              },
              {
                onSuccess: () => {
                  router.push(`/${chainSlug}/${contractAddress}`);
                },
                onError: (err) => {
                  console.error(err);
                },
              },
            );
          } catch (err) {
            toast.error("Failed to import contract");
            console.error(err);
          }
        })}
      >
        <FormField
          control={form.control}
          name="contractAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract Address</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="h-3" />
        <div>
          <Label className="mb-3 inline-block">Network</Label>
          <SingleNetworkSelector
            chainId={form.watch("chainId")}
            onChange={(v) => form.setValue("chainId", v)}
            side="top"
          />
        </div>

        <div className="h-8" />

        <div className="flex justify-end">
          <Button type="submit" className="gap-2">
            {showLoading ? (
              <Spinner className="size-4" />
            ) : (
              <PlusIcon className="size-4" />
            )}

            {showLoading
              ? addToDashboard.isSuccess || isRedirecting
                ? "Redirecting"
                : "Importing contract"
              : "Import Contract"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
