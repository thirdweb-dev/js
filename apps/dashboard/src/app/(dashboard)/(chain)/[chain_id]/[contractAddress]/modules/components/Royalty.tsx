"use client";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CircleAlertIcon } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAddress, sendAndConfirmTransaction } from "thirdweb";
import { RoyaltyERC721 } from "thirdweb/modules";
import { useReadContract } from "thirdweb/react";
import { z } from "zod";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";
import type { ModuleInstanceProps } from "./module-instance";

function RoyaltyModule(props: ModuleInstanceProps) {
  const { contract, ownerAccount } = props;

  const defaultRoyaltyInfoQuery = useReadContract(
    RoyaltyERC721.getDefaultRoyaltyInfo,
    {
      contract: contract,
    },
  );
  const transferValidatorQuery = useReadContract(
    RoyaltyERC721.getTransferValidator,
    {
      contract: contract,
    },
  );

  const setRoyaltyInfoForToken = useCallback(
    async (values: RoyaltyInfoFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }

      const setRoyaltyForTokenTx = RoyaltyERC721.setRoyaltyInfoForToken({
        contract: contract,
        recipient: values.recipient,
        bps: Number(values.bps),
        tokenId: BigInt(values.tokenId),
      });

      await sendAndConfirmTransaction({
        account: ownerAccount,
        transaction: setRoyaltyForTokenTx,
      });
    },
    [contract, ownerAccount],
  );

  const update = useCallback(
    async (values: RoyaltyConfigFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }
      const [defaultRoyaltyRecipient, defaultRoyaltyBps] =
        defaultRoyaltyInfoQuery.data || [];

      if (
        values.recipient &&
        values.bps &&
        (values.recipient !== defaultRoyaltyRecipient ||
          Number(values.bps) !== defaultRoyaltyBps)
      ) {
        const setSaleConfigTx = RoyaltyERC721.setDefaultRoyaltyInfo({
          contract: contract,
          royaltyRecipient: values.recipient,
          royaltyBps: Number(values.bps),
        });

        await sendAndConfirmTransaction({
          account: ownerAccount,
          transaction: setSaleConfigTx,
        });
      }

      if (
        values.transferValidator &&
        values.transferValidator !== transferValidatorQuery.data
      ) {
        const setTransferValidatorTx = RoyaltyERC721.setTransferValidator({
          contract: contract,
          validator: values.transferValidator,
        });

        await sendAndConfirmTransaction({
          account: ownerAccount,
          transaction: setTransferValidatorTx,
        });
      }
    },
    [
      contract,
      ownerAccount,
      transferValidatorQuery.data,
      defaultRoyaltyInfoQuery.data,
    ],
  );

  return (
    <RoyaltyModuleUI
      {...props}
      isPending={
        transferValidatorQuery.isPending || defaultRoyaltyInfoQuery.isPending
      }
      transferValidator={transferValidatorQuery.data}
      defaultRoyaltyInfo={defaultRoyaltyInfoQuery.data}
      update={update}
      setRoyaltyInfoForToken={setRoyaltyInfoForToken}
      isOwnerAccount={!!ownerAccount}
    />
  );
}

export function RoyaltyModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    isPending: boolean;
    isOwnerAccount: boolean;
    defaultRoyaltyInfo?: readonly [string, number];
    transferValidator?: string;
    update: (values: RoyaltyConfigFormValues) => Promise<void>;
    setRoyaltyInfoForToken: (values: RoyaltyInfoFormValues) => Promise<void>;
  },
) {
  return (
    <ModuleCardUI {...props}>
      <div className="h-1" />
      {props.isPending && <Skeleton className="h-[74px]" />}

      {!props.isPending && (
        <Accordion type="single" collapsible className="-mx-1">
          <AccordionItem value="royaltyPerToken" className="border-none">
            <AccordionTrigger className="border-border border-t px-1">
              Royalty Info Per Token
            </AccordionTrigger>
            <AccordionContent className="px-1">
              {props.isOwnerAccount ? (
                <RoyaltyInfoPerTokenSection
                  setRoyaltyInfoForToken={props.setRoyaltyInfoForToken}
                />
              ) : (
                <Alert variant="info">
                  <CircleAlertIcon className="size-5" />
                  <AlertTitle>
                    You don't have permission to set royalty info per token
                  </AlertTitle>
                </Alert>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="defaultRoyaltyInfo" className="border-none">
            <AccordionTrigger className="border-border border-t px-1">
              Default Royalty Info & Transfer Validator
            </AccordionTrigger>
            <AccordionContent className="px-1">
              <DefaultRoyaltyInfoSection
                defaultRoyaltyInfo={props.defaultRoyaltyInfo}
                transferValidator={props.transferValidator}
                update={props.update}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </ModuleCardUI>
  );
}

const royaltyInfoFormSchema = z.object({
  tokenId: z
    .string()
    .min(1, { message: "Invalid Token ID" })
    .refine((v) => Number(v) >= 0, { message: "Invalid Token ID" }),
  recipient: z.string().refine(
    (v) => {
      if (isAddress(v)) {
        return true;
      }
      return false;
    },
    { message: "Invalid Address" },
  ),
  bps: z
    .string()
    .min(1, { message: "Invalid BPS" })
    .refine((v) => Number(v) >= 0, { message: "Invalid BPS" }),
});

export type RoyaltyInfoFormValues = z.infer<typeof royaltyInfoFormSchema>;

function RoyaltyInfoPerTokenSection(props: {
  setRoyaltyInfoForToken: (values: RoyaltyInfoFormValues) => Promise<void>;
}) {
  const form = useForm<RoyaltyInfoFormValues>({
    resolver: zodResolver(royaltyInfoFormSchema),
    values: {
      tokenId: "",
      recipient: "",
      bps: "",
    },
    reValidateMode: "onChange",
  });

  const setRoyaltyInfoForTokenMutation = useMutation({
    mutationFn: props.setRoyaltyInfoForToken,
  });

  const onSubmit = async () => {
    const promise = setRoyaltyInfoForTokenMutation.mutateAsync(
      form.getValues(),
    );
    toast.promise(promise, {
      success: "Successfully set royalty info for token",
      error: (error) => `Failed to set royalty info for token: ${error}`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="h-1" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="tokenId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Token ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Recipient</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bps"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>BPS</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              size="sm"
              className="min-w-24 gap-2"
              disabled={setRoyaltyInfoForTokenMutation.isPending}
              type="submit"
            >
              {setRoyaltyInfoForTokenMutation.isPending && (
                <Spinner className="size-4" />
              )}
              Update Royalty Info for Token
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

const defaultRoyaltyFormSchema = z.object({
  recipient: z.string().refine(
    (v) => {
      // return true if it is an empty string to emulate optional condition
      // don't return `isAddress(v)` directly to avoid typecasting address as `0x${string}
      if (!v || isAddress(v)) {
        return true;
      }
      return false;
    },
    { message: "Invalid Address" },
  ),
  bps: z.string().refine((v) => v.length === 0 || Number(v) >= 0, {
    message: "Invalid BPS",
  }),
  transferValidator: z.string().refine(
    (v) => {
      // return true if it is an empty string to emulate optional condition
      // don't return `isAddress(v)` directly to avoid typecasting address as `0x${string}
      if (!v || isAddress(v)) {
        return true;
      }
      return false;
    },
    { message: "Invalid Address" },
  ),
});

export type RoyaltyConfigFormValues = z.infer<typeof defaultRoyaltyFormSchema>;

function DefaultRoyaltyInfoSection(props: {
  defaultRoyaltyInfo?: readonly [string, number];
  transferValidator?: string;
  update: (values: RoyaltyConfigFormValues) => Promise<void>;
}) {
  const [defaultRoyaltyRecipient, defaultRoyaltyBps] =
    props.defaultRoyaltyInfo || [];

  const form = useForm<RoyaltyConfigFormValues>({
    resolver: zodResolver(defaultRoyaltyFormSchema),
    values: {
      transferValidator: props.transferValidator || "",
      recipient: defaultRoyaltyRecipient || "",
      bps: defaultRoyaltyBps ? String(defaultRoyaltyBps) : "",
    },
    reValidateMode: "onChange",
  });

  const updateMutation = useMutation({
    mutationFn: props.update,
  });

  const onSubmit = async () => {
    const promise = updateMutation.mutateAsync(form.getValues());
    toast.promise(promise, {
      success: "Successfully updated royalty info or transfer validator",
      error: (error) =>
        `Failed to update royalty info or transfer validator: ${error}`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="h-1" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Default Royalty Recipient</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bps"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Default Royalty BPS</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="h-2" />

          <FormField
            control={form.control}
            name="transferValidator"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Transfer Validator</FormLabel>
                <FormControl>
                  <Input placeholder="0x..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-4 flex justify-end">
            <Button
              size="sm"
              className="min-w-24 gap-2"
              disabled={updateMutation.isPending}
              type="submit"
            >
              {updateMutation.isPending && <Spinner className="size-4" />}
              Update
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default RoyaltyModule;
