"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import { CircleAlertIcon } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  type PreparedTransaction,
  getContract,
  sendAndConfirmTransaction,
} from "thirdweb";
import { getBytecode } from "thirdweb/contract";
import {
  MintableERC20,
  MintableERC721,
  MintableERC1155,
} from "thirdweb/modules";
import { grantRoles, hasAllRoles } from "thirdweb/modules";
import { useReadContract } from "thirdweb/react";
import { isContractDeployed } from "thirdweb/utils";
import type { NFTMetadataInputLimited } from "types/modified-types";
import { parseAttributes } from "utils/parseAttributes";
import { z } from "zod";
import ConfigureSplit from "../../split-fees/ConfigureSplitFees";
import { addressSchema } from "../zod-schemas";
import { ModuleCardUI, type ModuleCardUIProps } from "./module-card";
import type { ModuleInstanceProps } from "./module-instance";
import { AdvancedNFTMetadataFormGroup } from "./nft/AdvancedNFTMetadataFormGroup";
import { NFTMediaFormGroup } from "./nft/NFTMediaFormGroup";
import { PropertiesFormControl } from "./nft/PropertiesFormControl";

export type UpdateFormValues = {
  primarySaleRecipient: string;
};

export type MintFormValues = NFTMetadataInputLimited & {
  useNextTokenId: boolean;
  recipient: string;
  amount: number;
  customImage: string;
  customAnimationUrl: string;
  attributes: { trait_type: string; value: string }[];
  tokenId?: string;
};

const isValidNft = (values: MintFormValues) =>
  values.name ||
  values.description ||
  values.image ||
  values.animation_url ||
  values.external_url ||
  values.customAnimationUrl;

const MINTER_ROLE = 1n;

const splitWalletBytecode =
  "0x6080604052600436106100b15760003560e01c8063f04e283e11610069578063f61510891161004e578063f615108914610163578063f7448a3114610197578063fee81cf4146101b757600080fd5b8063f04e283e1461013d578063f2fde38b1461015057600080fd5b806354d1f13d1161009a57806354d1f13d146100d3578063715018a6146100db5780638da5cb5b146100e357600080fd5b806325692962146100b65780634329db46146100c0575b600080fd5b6100be6101f8565b005b6100be6100ce366004610629565b610248565b6100be6103a9565b6100be6103e5565b3480156100ef57600080fd5b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927545b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020015b60405180910390f35b6100be61014b36600461066b565b6103f9565b6100be61015e36600461066b565b610439565b34801561016f57600080fd5b506101137f000000000000000000000000b0293be0b3d5d5946cfa074b45d507319659c95f81565b3480156101a357600080fd5b506100be6101b236600461068d565b610460565b3480156101c357600080fd5b506101ea6101d236600461066b565b63389a75e1600c908152600091909152602090205490565b604051908152602001610134565b60006202a30067ffffffffffffffff164201905063389a75e1600c5233600052806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d600080a250565b3373ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000b0293be0b3d5d5946cfa074b45d507319659c95f16146102b7576040517f6fd1f78c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60007f000000000000000000000000b0293be0b3d5d5946cfa074b45d507319659c95f73ffffffffffffffffffffffffffffffffffffffff168260405160006040518083038185875af1925050503d8060008114610331576040519150601f19603f3d011682016040523d82523d6000602084013e610336565b606091505b50509050806103a5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f4661696c656420746f2073656e64204574686572000000000000000000000000604482015260640160405180910390fd5b5050565b63389a75e1600c523360005260006020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c92600080a2565b6103ed61058d565b6103f760006105c3565b565b61040161058d565b63389a75e1600c52806000526020600c20805442111561042957636f5e88186000526004601cfd5b60009055610436816105c3565b50565b61044161058d565b8060601b61045757637448fbae6000526004601cfd5b610436816105c3565b3373ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000b0293be0b3d5d5946cfa074b45d507319659c95f16146104cf576040517f6fd1f78c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040517fa9059cbb00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000b0293be0b3d5d5946cfa074b45d507319659c95f811660048301526024820183905283169063a9059cbb906044016020604051808303816000875af1158015610564573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061058891906106b7565b505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275433146103f7576382b429006000526004601cfd5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927805473ffffffffffffffffffffffffffffffffffffffff9092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a355565b60006020828403121561063b57600080fd5b5035919050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461066657600080fd5b919050565b60006020828403121561067d57600080fd5b61068682610642565b9392505050565b600080604083850312156106a057600080fd5b6106a983610642565b946020939093013593505050565b6000602082840312156106c957600080fd5b8151801515811461068657600080fdfea264697066735822122007cf0f59b98eb9ce1e88de58df5114d9b37a2fb3de097a3520bda4a6ac89592664736f6c634300081a0033";

function MintableModule(props: ModuleInstanceProps) {
  const { contract, ownerAccount } = props;

  const isErc721 = props.contractInfo.name === "MintableERC721";

  const primarySaleRecipientQuery = useReadContract(
    isErc721 ? MintableERC721.getSaleConfig : MintableERC1155.getSaleConfig,
    {
      contract: contract,
    },
  );
  const hasMinterRole = useReadContract(hasAllRoles, {
    contract: contract,
    user: ownerAccount?.address || "",
    roles: MINTER_ROLE,
  });

  const splitRecipientContract = getContract({
    address: primarySaleRecipientQuery.data || "",
    chain: contract.chain,
    client: contract.client,
  });

  const isSplitRecipientQuery = useQuery({
    queryKey: ["isSplitRecipient", primarySaleRecipientQuery.data],
    queryFn: async () => {
      if (!primarySaleRecipientQuery.data) return false;

      const contractDeployed = await isContractDeployed(splitRecipientContract);
      if (!contractDeployed) return false;

      const bytecode = await getBytecode(splitRecipientContract);
      if (bytecode !== splitWalletBytecode) return false;

      return true;
    },
    enabled: !!primarySaleRecipientQuery.data,
  });

  const isBatchMetadataInstalled = !!props.allModuleContractInfo.find(
    (module) => module.name.includes("BatchMetadata"),
  );

  const mint = useCallback(
    async (values: MintFormValues) => {
      const nft = isValidNft(values) ? parseAttributes(values) : "";
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }

      if (!hasMinterRole.data) {
        const grantRoleTx = grantRoles({
          contract,
          user: ownerAccount.address,
          roles: MINTER_ROLE,
        });

        await sendAndConfirmTransaction({
          account: ownerAccount,
          transaction: grantRoleTx,
        });
      }

      let mintTx: PreparedTransaction;
      if (props.contractInfo.name === "MintableERC721") {
        mintTx = MintableERC721.mintWithRole({
          contract,
          to: values.recipient,
          nfts: [nft],
        });
      } else if (props.contractInfo.name === "MintableERC20") {
        mintTx = MintableERC20.mintWithRole({
          contract,
          to: values.recipient,
          quantity: String(values.amount),
        });
      } else if (values.useNextTokenId || values.tokenId) {
        mintTx = MintableERC1155.mintWithRole({
          contract,
          to: values.recipient,
          amount: BigInt(values.amount),
          tokenId: values.tokenId ? BigInt(values.tokenId) : undefined,
          nft,
        });
      } else {
        throw new Error("Invalid token ID");
      }

      await sendAndConfirmTransaction({
        account: ownerAccount,
        transaction: mintTx,
      });
    },
    [contract, ownerAccount, hasMinterRole.data, props.contractInfo.name],
  );

  const update = useCallback(
    async (values: UpdateFormValues) => {
      if (!ownerAccount) {
        throw new Error("Not an owner account");
      }

      const setSaleConfig =
        props.contractInfo.name === "MintableERC721"
          ? MintableERC721.setSaleConfig
          : props.contractInfo.name === "MintableERC20"
            ? MintableERC20.setSaleConfig
            : MintableERC1155.setSaleConfig;

      const setSaleConfigTx = setSaleConfig({
        contract: contract,
        primarySaleRecipient: values.primarySaleRecipient,
      });

      await sendAndConfirmTransaction({
        account: ownerAccount,
        transaction: setSaleConfigTx,
      });
    },
    [contract, ownerAccount, props.contractInfo.name],
  );

  return (
    <MintableModuleUI
      {...props}
      isPending={
        primarySaleRecipientQuery.isPending || isSplitRecipientQuery.isPending
      }
      primarySaleRecipient={primarySaleRecipientQuery.data}
      isSplitRecipient={isSplitRecipientQuery.data}
      updatePrimaryRecipient={update}
      mint={mint}
      isOwnerAccount={!!ownerAccount}
      name={props.contractInfo.name}
      isBatchMetadataInstalled={isBatchMetadataInstalled}
      contractChainId={contract.chain.id}
    />
  );
}

export function MintableModuleUI(
  props: Omit<ModuleCardUIProps, "children" | "updateButton"> & {
    primarySaleRecipient?: string | undefined;
    isSplitRecipient?: boolean;
    isPending: boolean;
    isOwnerAccount: boolean;
    updatePrimaryRecipient: (values: UpdateFormValues) => Promise<void>;
    mint: (values: MintFormValues) => Promise<void>;
    name: string;
    isBatchMetadataInstalled: boolean;
    contractChainId: number;
  },
) {
  return (
    <ModuleCardUI {...props}>
      <div className="h-1" />
      {props.isPending && <Skeleton className="h-[74px]" />}

      {!props.isPending && (
        <div className="flex flex-col gap-4">
          {/* Mint NFT */}
          <Accordion type="single" collapsible className="-mx-1">
            <AccordionItem value="metadata" className="border-none">
              <AccordionTrigger className="border-border border-t px-1">
                Mint NFT
              </AccordionTrigger>
              <AccordionContent className="px-1">
                {props.isOwnerAccount && (
                  <MintNFTSection
                    mint={props.mint}
                    name={props.name}
                    isBatchMetadataInstalled={props.isBatchMetadataInstalled}
                    contractChainId={props.contractChainId}
                  />
                )}
                {!props.isOwnerAccount && (
                  <Alert variant="info">
                    <CircleAlertIcon className="size-5" />
                    <AlertTitle>
                      You don't have permission to mint NFTs on this contract
                    </AlertTitle>
                  </Alert>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="primary-sale-recipient"
              className="border-none "
            >
              <AccordionTrigger className="border-border border-t px-1">
                Primary Sale Recipient
              </AccordionTrigger>
              <AccordionContent className="px-1">
                <PrimarySalesSection
                  isOwnerAccount={props.isOwnerAccount}
                  primarySaleRecipient={props.primarySaleRecipient}
                  isSplitRecipient={props.isSplitRecipient}
                  update={props.updatePrimaryRecipient}
                  contractChainId={props.contractChainId}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </ModuleCardUI>
  );
}

const primarySaleRecipientFormSchema = z.object({
  primarySaleRecipient: addressSchema,
});

function PrimarySalesSection(props: {
  primarySaleRecipient: string | undefined;
  isSplitRecipient?: boolean;
  update: (values: UpdateFormValues) => Promise<void>;
  isOwnerAccount: boolean;
  contractChainId: number;
}) {
  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(primarySaleRecipientFormSchema),
    values: {
      primarySaleRecipient: props.primarySaleRecipient ?? "",
    },
  });

  const updateNotifications = useTxNotifications(
    "Successfully updated primary sale recipient",
    "Failed to update primary sale recipient",
  );

  const updateMutation = useMutation({
    mutationFn: props.update,
    onSuccess: updateNotifications.onSuccess,
    onError: updateNotifications.onError,
  });

  const onSubmit = async () => {
    updateMutation.mutateAsync(form.getValues());
  };

  const postSplitConfigure = async (splitWallet: string) => {
    form.setValue("primarySaleRecipient", splitWallet);
    await onSubmit();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="primarySaleRecipient"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                The wallet address that should receive the revenue from initial
                sales of the assets.
              </FormDescription>
              <FormControl>
                <div className="flex">
                  <Input
                    placeholder="0x..."
                    {...field}
                    disabled={!props.isOwnerAccount}
                    className="rounded-r-none border-r-0"
                  />
                  <ConfigureSplit
                    isNewSplit={!props.isSplitRecipient}
                    splitWallet={props.primarySaleRecipient || ""}
                    postSplitConfigure={
                      props.isSplitRecipient ? undefined : postSplitConfigure
                    }
                  >
                    <Button className="rounded-lg rounded-l-none border border-l-0 bg-foreground">
                      {props.isSplitRecipient ? "Update Split" : "Create Split"}
                    </Button>
                  </ConfigureSplit>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex justify-end">
          <TransactionButton
            size="sm"
            className="min-w-24"
            disabled={updateMutation.isPending || !props.isOwnerAccount}
            type="submit"
            isPending={updateMutation.isPending}
            transactionCount={1}
            txChainID={props.contractChainId}
          >
            Update
          </TransactionButton>
        </div>
      </form>{" "}
    </Form>
  );
}

const mintFormSchema = z.object({
  useNextTokenId: z.boolean(),
  customImage: z.string().optional(),
  customAnimationUrl: z.string().optional(),
  recipient: addressSchema,
  tokenId: z.coerce.number().min(0, { message: "Invalid tokenId" }).optional(),
});

function MintNFTSection(props: {
  mint: (values: MintFormValues) => Promise<void>;
  name: string;
  isBatchMetadataInstalled: boolean;
  contractChainId: number;
}) {
  const form = useForm<MintFormValues>({
    resolver: zodResolver(mintFormSchema),
    values: {
      useNextTokenId: false,
      customImage: "",
      customAnimationUrl: "",
      recipient: "",
      attributes: [{ trait_type: "", value: "" }],
      amount: 1,
    },
    reValidateMode: "onChange",
  });

  const mintNotifications = useTxNotifications(
    "Successfully minted NFT",
    "Failed to mint NFT",
  );

  const mintMutation = useMutation({
    mutationFn: props.mint,
    onSuccess: mintNotifications.onSuccess,
    onError: mintNotifications.onError,
  });

  const onSubmit = async () => {
    const values = form.getValues();
    if (
      props.name === "MintableERC1155" &&
      !values.useNextTokenId &&
      !values.tokenId
    ) {
      form.setError("tokenId", { message: "Token ID is required" });
      return;
    }
    mintMutation.mutateAsync(values);
  };

  const useNextTokenId = form.watch("useNextTokenId");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          {props.isBatchMetadataInstalled && (
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Left */}
              <div className="shrink-0 lg:w-[300px]">
                <NFTMediaFormGroup form={form} previewMaxWidth="300px" />
              </div>

              {/* Right */}
              <div className="flex grow flex-col gap-6">
                {/* name  */}
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

                {/* Description */}
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

                <PropertiesFormControl form={form} />

                {/* Advanced options */}
                <Accordion
                  type="single"
                  collapsible={
                    !(
                      form.formState.errors.background_color ||
                      form.formState.errors.external_url
                    )
                  }
                >
                  <AccordionItem
                    value="advanced-options"
                    className="-mx-1 border-t border-b-0"
                  >
                    <AccordionTrigger className="px-1">
                      Advanced Options
                    </AccordionTrigger>
                    <AccordionContent className="px-1">
                      <AdvancedNFTMetadataFormGroup form={form} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          )}

          <Separator />

          {/* Other options */}
          <div className="flex flex-col gap-4 md:flex-row">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Recipient Address</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {props.name !== "MintableERC721" && (
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {props.name === "MintableERC1155" && (
              <div className="relative flex-1">
                <FormField
                  control={form.control}
                  name="tokenId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Token ID</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={useNextTokenId} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="useNextTokenId"
                  render={({ field }) => (
                    <FormItem className="absolute top-0 right-0 flex items-center gap-2">
                      <CheckboxWithLabel>
                        <Checkbox
                          className="mt-0"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        Use next token ID
                      </CheckboxWithLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <TransactionButton
              size="sm"
              className="min-w-24"
              disabled={mintMutation.isPending}
              type="submit"
              isPending={mintMutation.isPending}
              txChainID={props.contractChainId}
              transactionCount={1}
            >
              Mint
            </TransactionButton>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default MintableModule;
