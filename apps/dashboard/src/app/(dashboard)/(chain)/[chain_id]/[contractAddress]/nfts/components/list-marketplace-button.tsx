"use client";

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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type ThirdwebContract, getContract, isAddress } from "thirdweb";
import { z } from "zod";
import { CreateListingsForm } from "../../(marketplace)/components/list-form";

type Props = {
  type: "ERC1155" | "ERC721";
  contract: ThirdwebContract;
  tokenId: bigint;
};

type Action = {
  value: "direct-listings" | "english-auctions";
  text: string;
};
const actions: Action[] = [
  {
    value: "direct-listings",
    text: "Create Direct Listing",
  },
  {
    value: "english-auctions",
    text: "Create English Auction",
  },
];

const formSchema = z.object({
  contractAddress: z.string().refine((value) => isAddress(value), {
    message: "Invalid Ethereum address",
  }),
});

export function ListMarketplaceButton(props: Props) {
  const [selectedAction, setSelectedAction] =
    useState<(typeof actions)[number]>();
  const handleOpenChange = (isOpen: boolean) => {
    setSelectedAction(isOpen ? actions[0] : undefined);
  };
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractAddress: "",
    },
  });
  const client = useThirdwebClient();
  const [marketplaceContract, setMarketplaceContract] =
    useState<ThirdwebContract>();

  const handleSubmit = (action: (typeof actions)[number]) => {
    form.handleSubmit((d) => {
      const marketplaceContract = getContract({
        address: d.contractAddress,
        chain: props.contract.chain,
        client,
      });
      setMarketplaceContract(marketplaceContract);
      setSelectedAction(action);
    })();
  };

  return (
    <>
      <Form {...form}>
        <form className="w-full md:max-w-[400px]">
          <FormField
            control={form.control}
            name="contractAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Marketplace Contract on{" "}
                  {props.contract.chain?.name ||
                    `chainId: ${props.contract.chain.id}`}
                </FormLabel>
                <FormControl>
                  <Input placeholder="0x..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            {actions.map((item) => (
              <Button
                key={item.value}
                variant="primary"
                className="gap-2"
                onClick={() => handleSubmit(item)}
              >
                {item.text}
              </Button>
            ))}
          </div>
        </form>
      </Form>

      <Sheet open={!!selectedAction} onOpenChange={handleOpenChange}>
        <SheetContent className="w-full overflow-y-auto sm:min-w-[540px] lg:min-w-[700px]">
          <SheetHeader>
            <SheetTitle className="text-left">
              {selectedAction?.text}
            </SheetTitle>
          </SheetHeader>
          {marketplaceContract && selectedAction && (
            <CreateListingsForm
              contract={marketplaceContract}
              type={selectedAction.value}
              actionText={selectedAction.text}
              setOpen={handleOpenChange}
              prefilledNFT={{
                id: String(props.tokenId),
                type: props.type,
                contractAddress: props.contract.address,
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
