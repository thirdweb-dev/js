import {
  useContractPrePublishMetadata,
  useContractPublishMetadataFromURI,
} from "../hooks";
import { ContractId } from "../types";
import { Image, Skeleton } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { ChakraNextImage, ChakraNextImageProps } from "components/Image";
import { replaceIpfsUrl } from "lib/sdk";
import { StaticImageData } from "next/image";

interface ContractIdImageProps
  extends Omit<ChakraNextImageProps, "src" | "alt" | "boxSize"> {
  contractId: ContractId;
  boxSize?: number;
}

export const ContractIdImage: React.FC<ContractIdImageProps> = ({
  contractId,
  boxSize = 8,
  ...imgProps
}) => {
  const address = useAddress();

  const fullPublishMetadata = useContractPrePublishMetadata(
    contractId,
    address,
  );
  const publishMetadata = useContractPublishMetadataFromURI(contractId);

  const logo =
    fullPublishMetadata.data?.latestPublishedContractMetadata?.publishedMetadata
      .logo;

  const img =
    publishMetadata.data?.image !== "custom"
      ? publishMetadata.data?.image ||
        require("/public/assets/tw-icons/general.png")
      : require("/public/assets/tw-icons/general.png");

  const isStaticImage = img && typeof img !== "string";

  return (
    <Skeleton isLoaded={publishMetadata.isSuccess}>
      {logo ? (
        <Image
          alt=""
          boxSize={boxSize}
          src={replaceIpfsUrl(logo)}
          borderRadius="full"
        />
      ) : isStaticImage ? (
        <ChakraNextImage
          {...imgProps}
          boxSize={boxSize}
          src={img as StaticImageData}
          alt={publishMetadata.data?.name || "Contract Image"}
        />
      ) : (
        <Image
          {...imgProps}
          boxSize={boxSize}
          src={img as string}
          alt={publishMetadata.data?.name || "Contract Image"}
        />
      )}
    </Skeleton>
  );
};
