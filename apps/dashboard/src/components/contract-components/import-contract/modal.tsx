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
import { zodResolver } from "@hookform/resolvers/zod";
import { useChainSlug } from "hooks/chains/chainSlug";
import { ExternalLinkIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThirdwebClient, getAddress, isAddress } from "thirdweb";
import { useActiveWalletChain } from "thirdweb/react";
import { z } from "zod";
import { useAddContractToProject } from "../../../app/(app)/team/[team_slug]/[project_slug]/hooks/project-contracts";

type ImportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  projectId: string;
  client: ThirdwebClient;
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
      <DialogContent dialogOverlayClassName="rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-semibold text-2xl tracking-tight">
            Import Contract
          </DialogTitle>
          <DialogDescription>
            Import an already deployed contract into thirdweb by entering a
            contract address below.
          </DialogDescription>
        </DialogHeader>

        <ImportForm
          teamId={props.teamId}
          projectId={props.projectId}
          client={props.client}
        />
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

function ImportForm(props: {
  teamId: string;
  projectId: string;
  client: ThirdwebClient;
}) {
  const router = useDashboardRouter();
  const activeChainId = useActiveWalletChain()?.id;

  const form = useForm({
    resolver: zodResolver(importFormSchema),
    values: {
      contractAddress: "",
      chainId: activeChainId || 1,
    },
  });
  const chainSlug = useChainSlug(form.watch("chainId"));
  const addContractToProject = useAddContractToProject();

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

            addContractToProject.mutate(
              {
                contractAddress,
                chainId: chainId.toString(),
                teamId: props.teamId,
                projectId: props.projectId,
              },
              {
                onSuccess: () => {
                  router.refresh();
                  toast.success("Contract imported successfully");
                },
                onError: (err) => {
                  console.error(err);
                  if (err.message.includes("PROJECT_CONTRACT_ALREADY_EXISTS")) {
                    toast.error("Contract is already added to the project");
                  } else {
                    toast.error("Failed to import contract");
                  }
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
            client={props.client}
            chainId={form.watch("chainId")}
            onChange={(v) => form.setValue("chainId", v)}
            side="top"
          />
        </div>

        <div className="h-8" />

        <div className="flex justify-end">
          {addContractToProject.isSuccess &&
          addContractToProject.data?.result ? (
            <Button asChild className="gap-2">
              <Link
                href={`/${chainSlug}/${addContractToProject.data.result.contractAddress}`}
                target="_blank"
              >
                View Contract <ExternalLinkIcon className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button type="submit" className="gap-2">
              {addContractToProject.isPending ? (
                <Spinner className="size-4" />
              ) : (
                <PlusIcon className="size-4" />
              )}

              {addContractToProject.isPending
                ? "Importing contract"
                : "Import Contract"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
