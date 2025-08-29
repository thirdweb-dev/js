"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CircleAlertIcon } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { OpenEditionMetadataERC721 } from "thirdweb/modules";
import { z } from "zod";
import { TransactionButton } from "@/components/tx-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSendAndConfirmTx } from "@/hooks/useSendTx";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";
import type { ModuleInstanceProps } from "./module-instance";

const setSharedMetadataFormSchema = z.object({
  animationUri: z.string().optional(),
  description: z.string().min(1),
  imageUri: z.string().optional(),
  name: z.string().min(1),
});

export type SetSharedMetadataFormValues = z.infer<
  typeof setSharedMetadataFormSchema
>;

function OpenEditionMetadataModule(props: ModuleInstanceProps) {
  const { contract, ownerAccount } = props;
  const sendAndConfirmTx = useSendAndConfirmTx();
  const setSharedMetadata = useCallback(
    async (values: SetSharedMetadataFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an Owner account");
      }

      const setSharedMetadataTx = OpenEditionMetadataERC721.setSharedMetadata({
        contract,
        metadata: {
          animationURI: values.animationUri || "",
          description: values.description,
          imageURI: values.imageUri || "",
          name: values.name,
        },
      });

      await sendAndConfirmTx.mutateAsync(setSharedMetadataTx);
    },
    [contract, ownerAccount, sendAndConfirmTx.mutateAsync],
  );

  return (
    <OpenEditionMetadataModuleUI
      {...props}
      client={props.contract.client}
      contractChainId={props.contract.chain.id}
      isOwnerAccount={!!props.ownerAccount}
      setSharedMetadata={setSharedMetadata}
    />
  );
}

export function OpenEditionMetadataModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    isOwnerAccount: boolean;
    setSharedMetadata: (values: SetSharedMetadataFormValues) => Promise<void>;
    contractChainId: number;
    isLoggedIn: boolean;
  },
) {
  return (
    <ModuleCardUI {...props}>
      <div className="h-1" />
      <Accordion className="-mx-1" collapsible type="single">
        <AccordionItem className="border-none" value="metadata">
          <AccordionTrigger className="border-border border-t px-1">
            Set Shared Metadata
          </AccordionTrigger>
          <AccordionContent className="px-1">
            {props.isOwnerAccount && (
              <SetSharedMetadataSection
                client={props.client}
                contractChainId={props.contractChainId}
                isLoggedIn={props.isLoggedIn}
                setSharedMetadata={props.setSharedMetadata}
              />
            )}
            {!props.isOwnerAccount && (
              <Alert variant="info">
                <CircleAlertIcon className="size-5" />
                <AlertTitle>
                  You don't have permission to set shared metadata on this
                  contract
                </AlertTitle>
              </Alert>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </ModuleCardUI>
  );
}

function SetSharedMetadataSection(props: {
  setSharedMetadata: (values: SetSharedMetadataFormValues) => Promise<void>;
  contractChainId: number;
  isLoggedIn: boolean;
  client: ThirdwebClient;
}) {
  const form = useForm<SetSharedMetadataFormValues>({
    resolver: zodResolver(setSharedMetadataFormSchema),
    reValidateMode: "onChange",
    values: {
      animationUri: "",
      description: "",
      imageUri: "",
      name: "",
    },
  });

  const setSharedMetadataNotifications = useTxNotifications(
    "Successfully set shared metadata",
    "Failed to set shared metadata",
  );

  const setSharedMetadataMutation = useMutation({
    mutationFn: props.setSharedMetadata,
    onError: setSharedMetadataNotifications.onError,
    onSuccess: setSharedMetadataNotifications.onSuccess,
  });

  const onSubmit = async () => {
    setSharedMetadataMutation.mutateAsync(form.getValues());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUri"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Image URI</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="animationUri"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Animation URI</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <TransactionButton
              className="min-w-24"
              client={props.client}
              disabled={setSharedMetadataMutation.isPending}
              isLoggedIn={props.isLoggedIn}
              isPending={setSharedMetadataMutation.isPending}
              size="sm"
              transactionCount={1}
              txChainID={props.contractChainId}
              type="submit"
            >
              Update
            </TransactionButton>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default OpenEditionMetadataModule;
