"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import { CircleAlertIcon } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { sendAndConfirmTransaction } from "thirdweb";
import { OpenEditionMetadataERC721 } from "thirdweb/modules";
import { z } from "zod";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";
import type { ModuleInstanceProps } from "./module-instance";

const setSharedMetadataFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  imageUri: z.string().optional(),
  animationUri: z.string().optional(),
});

export type SetSharedMetadataFormValues = z.infer<
  typeof setSharedMetadataFormSchema
>;

function OpenEditionMetadataModule(props: ModuleInstanceProps) {
  const { contract, ownerAccount } = props;

  const setSharedMetadata = useCallback(
    async (values: SetSharedMetadataFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an Owner account");
      }

      const setSharedMetadataTx = OpenEditionMetadataERC721.setSharedMetadata({
        contract,
        metadata: {
          name: values.name,
          description: values.description,
          imageURI: values.imageUri || "",
          animationURI: values.animationUri || "",
        },
      });

      await sendAndConfirmTransaction({
        transaction: setSharedMetadataTx,
        account: ownerAccount,
      });
    },
    [contract, ownerAccount],
  );

  return (
    <OpenEditionMetadataModuleUI
      {...props}
      setSharedMetadata={setSharedMetadata}
      isOwnerAccount={!!props.ownerAccount}
      contractChainId={props.contract.chain.id}
    />
  );
}

export function OpenEditionMetadataModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    isOwnerAccount: boolean;
    setSharedMetadata: (values: SetSharedMetadataFormValues) => Promise<void>;
    contractChainId: number;
  },
) {
  return (
    <ModuleCardUI {...props}>
      <div className="h-1" />
      <Accordion type="single" collapsible className="-mx-1">
        <AccordionItem value="metadata" className="border-none">
          <AccordionTrigger className="border-border border-t px-1">
            Set Shared Metadata
          </AccordionTrigger>
          <AccordionContent className="px-1">
            {props.isOwnerAccount && (
              <SetSharedMetadataSection
                setSharedMetadata={props.setSharedMetadata}
                contractChainId={props.contractChainId}
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
}) {
  const form = useForm<SetSharedMetadataFormValues>({
    resolver: zodResolver(setSharedMetadataFormSchema),
    values: {
      name: "",
      description: "",
      imageUri: "",
      animationUri: "",
    },
    reValidateMode: "onChange",
  });

  const setSharedMetadataNotifications = useTxNotifications(
    "Successfully set shared metadata",
    "Failed to set shared metadata",
  );

  const setSharedMetadataMutation = useMutation({
    mutationFn: props.setSharedMetadata,
    onSuccess: setSharedMetadataNotifications.onSuccess,
    onError: setSharedMetadataNotifications.onError,
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
              size="sm"
              className="min-w-24"
              disabled={setSharedMetadataMutation.isPending}
              type="submit"
              isPending={setSharedMetadataMutation.isPending}
              transactionCount={1}
              txChainID={props.contractChainId}
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
