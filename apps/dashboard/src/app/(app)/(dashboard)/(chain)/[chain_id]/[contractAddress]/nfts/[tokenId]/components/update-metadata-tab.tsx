import { useState } from "react";
import type { NFT, ThirdwebContract } from "thirdweb";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UpdateNftMetadata } from "./update-metadata-form";

interface UpdateMetadataTabProps {
  contract: ThirdwebContract;
  nft: NFT;

  /**
   * If useUpdateMetadata (NFT Drop, Edition Drop) -> use `updateMetadata`
   * else (NFT Collection, Edition) -> use `setTokenURI`
   */
  useUpdateMetadata: boolean;
  isLoggedIn: boolean;
}

const UpdateMetadataTab: React.FC<UpdateMetadataTabProps> = ({
  contract,
  nft,
  useUpdateMetadata,
  isLoggedIn,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button variant="primary">Update Metadata</Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:min-w-[540px] lg:min-w-[700px]">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-left">Update NFT Metadata</SheetTitle>
        </SheetHeader>
        <UpdateNftMetadata
          contract={contract}
          isLoggedIn={isLoggedIn}
          nft={nft}
          setOpen={setOpen}
          useUpdateMetadata={useUpdateMetadata}
        />
      </SheetContent>
    </Sheet>
  );
};

export default UpdateMetadataTab;
