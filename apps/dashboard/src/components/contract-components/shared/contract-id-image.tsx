import { Image, Skeleton } from "@chakra-ui/react";
import { ChakraNextImage, type ChakraNextImageProps } from "components/Image";
import { replaceIpfsUrl } from "lib/sdk";
import type { StaticImageData } from "next/image";
import { useFetchDeployMetadata } from "../hooks";
import type { ContractId } from "../types";

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
  const deployMetadataResultQuery = useFetchDeployMetadata(contractId);

  const logo = deployMetadataResultQuery.data?.logo;

  const img =
    deployMetadataResultQuery.data?.image !== "custom"
      ? deployMetadataResultQuery.data?.image ||
        require("../../../../public/assets/tw-icons/general.png")
      : require("../../../../public/assets/tw-icons/general.png");

  const isStaticImage = img && typeof img !== "string";

  return (
    <Skeleton isLoaded={deployMetadataResultQuery.isSuccess}>
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
          alt={deployMetadataResultQuery.data?.name || "Contract Image"}
        />
      ) : (
        <Image
          {...imgProps}
          boxSize={boxSize}
          src={img as string}
          alt={deployMetadataResultQuery.data?.name || "Contract Image"}
        />
      )}
    </Skeleton>
  );
};
