"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LinkIcon } from "lucide-react";
import { type PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Bridge, createThirdwebClient, isAddress, toUnits } from "thirdweb";
import { resolveScheme, upload } from "thirdweb/storage";
import { checksumAddress, shortenAddress } from "thirdweb/utils";
import z from "zod";
import { createPaymentLink } from "@/api/universal-bridge/developer";
import { getUniversalBridgeTokens } from "@/api/universal-bridge/tokens";
import { FileInput } from "@/components/blocks/FileInput";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { TokenSelector } from "@/components/blocks/TokenSelector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  RequiredFormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { parseErrorToMessage } from "@/utils/errorParser";

const formSchema = z.object({
  chainId: z.number(),
  tokenAddress: z.string(),
  recipient: z.string(),
  amount: z.coerce.number(),
  title: z.string(),
  imageUrl: z.string(),
});

export function CreatePaymentLinkButton(
  props: PropsWithChildren<{ teamId: string }>,
) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File>();
  const client = getClientThirdwebClient();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      chainId: 1,
      tokenAddress: undefined,
      recipient: undefined,
      amount: undefined,
      title: undefined,
      imageUrl: undefined,
    },
    resolver: zodResolver(formSchema),
  });

  const queryClient = useQueryClient();
  const chainsQuery = useQuery({
    queryFn: async () => {
      return await Bridge.chains({ client });
    },
    queryKey: ["payments-chains"],
  });
  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      console.log(values);
      const tokens = await getUniversalBridgeTokens({
        chainId: values.chainId,
        address: values.tokenAddress,
      });

      const token = tokens[0];
      if (!token) {
        throw new Error("Token not found");
      }

      await createPaymentLink({
        clientId: client.clientId,
        teamId: props.teamId,
        intent: {
          destinationChainId: values.chainId,
          destinationTokenAddress: checksumAddress(values.tokenAddress),
          receiver: checksumAddress(values.recipient),
          amount: toUnits(values.amount.toString(), token.decimals),
        },
        title: values.title,
        imageUrl: values.imageUrl,
      });
      return null;
    },
    onSuccess: () => {
      toast.success("Payment link created successfully.");
      return queryClient.invalidateQueries({
        queryKey: ["payment-links", client.clientId, props.teamId],
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error(parseErrorToMessage(err), { duration: 5000 });
    },
  });
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const uploadClient = createThirdwebClient({
        clientId: "f958464759859da7a1c6f9d905c90a43", //7ae789153cf9ecde8f35649f2d8a4333", // Special client ID for uploads only on thirdweb.com
      });
      const uri = await upload({
        client: uploadClient,
        files: [file],
      });

      // eslint-disable-next-line no-restricted-syntax
      const resolvedUrl = resolveScheme({
        client: uploadClient,
        uri,
      });

      form.setValue("imageUrl", resolvedUrl);
      return;
    },
    onSuccess: () => {
      toast.success("Image uploaded successfully.");
    },
    onError: (e) => {
      console.error(e);
      setImage(undefined);
      toast.error(parseErrorToMessage(e), { duration: 5000 });
    },
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="!max-w-xl">
        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit((values) =>
              createMutation.mutateAsync(values, {
                onSuccess: () => {
                  setOpen(false);
                  form.reset();
                  form.clearErrors();
                },
              }),
            )}
          >
            <DialogHeader>
              <DialogTitle>Create a Payment Link</DialogTitle>
              <DialogDescription>
                Get paid in any token on any chain.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6 w-full">
              <FormField
                name="image"
                render={() => (
                  <FormItem className="w-full">
                    <RequiredFormLabel>Image</RequiredFormLabel>
                    <FileInput
                      accept={{ "image/*": [] }}
                      className="rounded-md h-32"
                      client={client}
                      helperText="image"
                      isDisabled={uploadMutation.isPending}
                      isDisabledText="Uploading..."
                      selectOrUpload="Upload"
                      setValue={async (file) => {
                        await uploadMutation.mutateAsync(file);
                        setImage(file);
                      }}
                      value={image}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="title"
                render={({ field }) => (
                  <FormItem className="">
                    <RequiredFormLabel>Title</RequiredFormLabel>
                    <Input {...field} placeholder="Payment for..." />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <RequiredFormLabel>Recipient Address</RequiredFormLabel>
                    <Input
                      className="w-full"
                      {...field}
                      onChange={field.onChange}
                      value={
                        isAddress(field.value)
                          ? shortenAddress(field.value)
                          : field.value
                      }
                      placeholder="Address or ENS"
                      required
                    />
                    <FormDescription>Address or ENS</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="chainId"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel>Chain</RequiredFormLabel>
                  <SingleNetworkSelector
                    chainIds={chainsQuery.data?.map((x) => x.chainId)}
                    chainId={field.value}
                    className="w-full"
                    client={client}
                    disableTestnets
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="tokenAddress"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel>Token</RequiredFormLabel>
                  <TokenSelector
                    addNativeTokenIfMissing={false}
                    chainId={form.getValues().chainId}
                    className="w-full"
                    client={client}
                    disabled={!form.getValues().chainId}
                    onChange={(token) => {
                      field.onChange(token.address);
                    }}
                    selectedToken={
                      field.value
                        ? {
                            address: field.value,
                            chainId: form.getValues().chainId,
                          }
                        : undefined
                    }
                    showCheck={false}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel>Amount</RequiredFormLabel>
                  <Input
                    className="w-full"
                    {...field}
                    placeholder="0.0"
                    required
                    step="any"
                    type="number"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 flex gap-2 items-center"
                  type="submit"
                  disabled={
                    uploadMutation.isPending || createMutation.isPending
                  }
                  onClick={() => console.log(form.getValues())}
                >
                  {createMutation.isPending ? (
                    <Spinner className="size-4" />
                  ) : (
                    <LinkIcon className="size-4" />
                  )}
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
