"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UnderlineLink } from "@workspace/ui/components/UnderlineLink";
import {
  ArrowDownToLineIcon,
  CircleAlertIcon,
  ExternalLinkIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  getAddress,
  getContract,
  isAddress,
  type ThirdwebClient,
} from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { useActiveWalletChain } from "thirdweb/react";
import { z } from "zod";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
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
import { Spinner } from "@/components/ui/Spinner";
import { useChainSlug } from "@/hooks/chains/chainSlug";
import { useAddContractToProject } from "@/hooks/project-contracts";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { revalidateCacheTagAction } from "../../../actions/revalidate";
import { projectContractsCacheTag } from "../../../api/project/cache-tag";
import { resolveFunctionSelectors } from "../../../lib/selectors";
import { supportedERCs } from "../../../utils/supportedERCs";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";

type ImportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  projectId: string;
  projectSlug: string;
  teamSlug: string;
  client: ThirdwebClient;
  type: "contract" | "asset";
  onSuccess?: () => void;
  allowedContractType: "token" | "non-token";
};

export const ImportModal: React.FC<ImportModalProps> = (props) => {
  return (
    <Dialog
      onOpenChange={(v) => {
        if (!v) {
          props.onClose();
        }
      }}
      open={props.isOpen}
    >
      <DialogContent
        className="gap-0 overflow-hidden p-0"
        dialogOverlayClassName="rounded-lg"
      >
        <DialogHeader className="p-6">
          <DialogTitle className="font-semibold text-2xl tracking-tight">
            Import {props.type === "contract" ? "Contract" : "Token"}
          </DialogTitle>
          <DialogDescription>
            Import a deployed contract in your project
          </DialogDescription>
        </DialogHeader>

        <ImportForm
          client={props.client}
          onSuccess={props.onSuccess}
          projectId={props.projectId}
          projectSlug={props.projectSlug}
          teamId={props.teamId}
          teamSlug={props.teamSlug}
          type={props.type}
          allowedContractType={props.allowedContractType}
        />
      </DialogContent>
    </Dialog>
  );
};

const importFormSchema = z.object({
  chainId: z.coerce.number(),
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
});

function ImportForm(props: {
  teamId: string;
  projectId: string;
  teamSlug: string;
  projectSlug: string;
  client: ThirdwebClient;
  type: "contract" | "asset";
  onSuccess?: () => void;
  allowedContractType: "token" | "non-token";
}) {
  const router = useDashboardRouter();
  const activeChainId = useActiveWalletChain()?.id;

  const form = useForm({
    resolver: zodResolver(importFormSchema),
    values: {
      chainId: activeChainId || 1,
      contractAddress: "",
    },
  });
  const chainSlug = useChainSlug(form.watch("chainId"));
  const addContractToProject = useAddContractToProject();

  const [notAllowedError, setNotAllowedError] = useState(false);

  return (
    <Form {...form}>
      <form
        onChange={() => {
          setNotAllowedError(false);
        }}
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

            // check if the contract matches the requirement
            const contract = getContract({
              address: contractAddress,
              // eslint-disable-next-line no-restricted-syntax
              chain: defineChain(chainId),
              client: props.client,
            });

            const functionSelectors = await resolveFunctionSelectors(contract);
            const ercs = supportedERCs(functionSelectors);

            const isToken = ercs.isERC20 || ercs.isERC721 || ercs.isERC1155;

            if (
              (props.allowedContractType === "token" && !isToken) ||
              (props.allowedContractType === "non-token" && isToken)
            ) {
              setNotAllowedError(true);
              return;
            }

            addContractToProject.mutate(
              {
                chainId: chainId.toString(),
                contractAddress,
                contractType: undefined,
                deploymentType: props.type === "contract" ? undefined : "asset",
                projectId: props.projectId,
                teamId: props.teamId,
              },
              {
                onError: (err) => {
                  console.error(err);
                  if (err.message.includes("PROJECT_CONTRACT_ALREADY_EXISTS")) {
                    toast.error("Contract is already added to the project");
                  } else {
                    toast.error("Failed to import contract");
                  }
                },
                onSuccess: () => {
                  revalidateCacheTagAction(
                    projectContractsCacheTag({
                      teamId: props.teamId,
                      projectId: props.projectId,
                    }),
                  );
                  router.refresh();
                  toast.success("Contract imported successfully");
                  props.onSuccess?.();
                },
              },
            );
          } catch (err) {
            toast.error("Failed to import contract");
            console.error(err);
          }
        })}
      >
        <div className="px-6">
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
              client={props.client}
              disableChainId
              onChange={(v) => form.setValue("chainId", v)}
              side="top"
            />
          </div>
        </div>

        {notAllowedError && (
          <div className="px-6 pt-6 text-sm text-destructive-text">
            <Alert variant="destructive">
              <CircleAlertIcon className="size-5" />
              <AlertTitle> Invalid Contract </AlertTitle>
              <AlertDescription>
                {props.allowedContractType === "token" && (
                  <span>
                    This contract is not a token contract. <br /> Only ERC20,
                    ERC721 and ERC1155 contracts can be imported as tokens.
                  </span>
                )}
                {props.allowedContractType === "non-token" && (
                  <span>
                    This contract is a token contract. <br /> Go to the{" "}
                    <UnderlineLink
                      href={`/team/${props.teamSlug}/${props.projectSlug}/tokens`}
                    >
                      Tokens
                    </UnderlineLink>{" "}
                    page to import in dashboard.
                  </span>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="mt-8 flex justify-end border-t bg-card p-6">
          {addContractToProject.isSuccess &&
          addContractToProject.data?.result ? (
            <Button asChild className="gap-2">
              <Link
                href={`/team/${props.teamSlug}/${props.projectSlug}/contract/${chainSlug}/${addContractToProject.data.result.contractAddress}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                View Contract <ExternalLinkIcon className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button className="gap-2" type="submit">
              {form.formState.isSubmitting ? (
                <Spinner className="size-4" />
              ) : (
                <ArrowDownToLineIcon className="size-4" />
              )}

              {form.formState.isSubmitting ? "Importing" : "Import"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
