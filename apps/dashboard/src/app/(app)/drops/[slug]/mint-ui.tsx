"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import type React from "react";
import { useId, useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import { balanceOf as balanceOfERC721 } from "thirdweb/extensions/erc721";
import { balanceOf as balanceOfERC1155 } from "thirdweb/extensions/erc1155";
import {
  ClaimButton,
  MediaRenderer,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { CustomConnectWallet } from "@/components/connect-wallet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTxNotifications } from "@/hooks/useTxNotifications";

type Props = {
  contract: ThirdwebContract;
  displayName: string;
  description: string;
  thumbnail: string;
  hideQuantitySelector?: boolean;
  hideMintToCustomAddress?: boolean;
} & ({ type: "erc1155"; tokenId: bigint } | { type: "erc721" }) &
  (
    | {
        pricePerToken: number;
        currencySymbol: string | null;
        noActiveClaimCondition: false;
        quantityLimitPerWallet: bigint;
      }
    | { noActiveClaimCondition: true }
  );

export function NftMint(props: Props) {
  const [isMinting, setIsMinting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [customAddress, setCustomAddress] = useState("");
  const account = useActiveAccount();
  const customAddressId = useId();
  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1); // Assuming a max of 10 NFTs can be minted at once
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value);
    if (!Number.isNaN(value)) {
      setQuantity(Math.min(Math.max(1, value)));
    }
  };

  const balance721Query = useReadContract(balanceOfERC721, {
    contract: props.contract,
    owner: account?.address || "",
    queryOptions: {
      enabled: props.type === "erc721" && !!account?.address,
    },
  });

  const balance1155Query = useReadContract(balanceOfERC1155, {
    contract: props.contract,
    owner: account?.address || "",
    queryOptions: {
      enabled: props.type === "erc1155" && !!account?.address,
    },
    tokenId: props.type === "erc1155" ? props.tokenId : 0n,
  });

  const ownedAmount =
    props.type === "erc1155"
      ? balance1155Query.data || 0n
      : balance721Query.data || 0n;

  const fullyMinted =
    props.noActiveClaimCondition === false &&
    props.quantityLimitPerWallet === ownedAmount;

  const mintNotifications = useTxNotifications(
    "NFT minted successfully",
    "Failed to mint NFT",
  );

  return (
    <div className="mx-4 my-16 flex flex-col items-center justify-center transition-colors duration-200">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
            <MediaRenderer
              alt=""
              className="h-full w-full object-cover"
              client={props.contract.client}
              src={props.thumbnail}
            />
            {!props.noActiveClaimCondition && (
              <Badge className="absolute top-2 right-2">
                {props.pricePerToken === 0
                  ? "Free"
                  : `${props.pricePerToken} ${props.currencySymbol}/each`}
              </Badge>
            )}
          </div>
          <h2 className="mb-2 font-bold text-2xl">{props.displayName}</h2>
          <p className="mb-4 text-muted-foreground">{props.description}</p>
          {!props.hideQuantitySelector && !props.noActiveClaimCondition && (
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  aria-label="Decrease quantity"
                  className="rounded-r-none"
                  disabled={quantity <= 1}
                  onClick={decreaseQuantity}
                  size="icon"
                  variant="outline"
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <Input
                  className="w-28 rounded-none border-x-0 pl-6 text-center"
                  min="1"
                  onChange={handleQuantityChange}
                  type="number"
                  value={quantity}
                />
                <Button
                  aria-label="Increase quantity"
                  className="rounded-l-none"
                  onClick={increaseQuantity}
                  size="icon"
                  variant="outline"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="pr-1 font-semibold text-base">
                Total: {props.pricePerToken * quantity} {props.currencySymbol}
              </div>
            </div>
          )}

          {!props.hideMintToCustomAddress && (
            <div className="mb-4 flex items-center space-x-2">
              <Switch
                checked={useCustomAddress}
                id={customAddressId}
                onCheckedChange={setUseCustomAddress}
              />
              <Label
                className={`${useCustomAddress ? "" : "text-gray-400"} cursor-pointer`}
                htmlFor="custom-address"
              >
                Mint to a custom address
              </Label>
            </div>
          )}
          {useCustomAddress && (
            <div className="mb-4">
              <Input
                className="w-full"
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="Enter recipient address"
                type="text"
                value={customAddress}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          {account ? (
            <ClaimButton
              chain={props.contract.chain}
              claimParams={
                props.type === "erc1155"
                  ? {
                      from: account.address,
                      quantity: BigInt(quantity),
                      to: customAddress || account.address,
                      tokenId: props.tokenId,
                      type: "ERC1155",
                    }
                  : {
                      from: account.address,
                      quantity: BigInt(quantity),
                      to: customAddress || account.address,
                      type: "ERC721",
                    }
              }
              client={props.contract.client}
              contractAddress={props.contract.address}
              disabled={
                isMinting || props.noActiveClaimCondition || fullyMinted
              }
              onError={(err) => {
                mintNotifications.onError(err);
                setIsMinting(false);
              }}
              onTransactionConfirmed={() => {
                mintNotifications.onSuccess();
                setIsMinting(false);
              }}
              onTransactionSent={() => {
                setIsMinting(true);
              }}
              style={{ width: "100%" }}
            >
              {fullyMinted
                ? "Minted"
                : props.noActiveClaimCondition
                  ? "Minting not ready"
                  : `${quantity > 1 ? `Mint ${quantity} NFTs` : "Mint"}`}
            </ClaimButton>
          ) : (
            <CustomConnectWallet
              chain={props.contract.chain}
              client={props.contract.client}
              connectButtonClassName="!w-full !rounded !bg-primary !text-primary-foreground !px-4 !py-2 !text-sm"
              isLoggedIn={true}
              loginRequired={false}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
