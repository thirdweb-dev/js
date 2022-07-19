import { useContractPublishMetadataFromURI } from "../hooks";
import { ContractId } from "../types";
import { Image, Skeleton } from "@chakra-ui/react";
import { ChakraNextImage, ChakraNextImageProps } from "components/Image";
import { FeatureIconMap } from "constants/mappings";
import { StaticImageData } from "next/image";

export interface ContractIdImageProps
  extends Omit<ChakraNextImageProps, "src" | "alt"> {
  contractId: ContractId;
}

export const ContractIdImage: React.FC<ContractIdImageProps> = ({
  contractId,
  boxSize = 8,
  ...imgProps
}) => {
  const publishMetadata = useContractPublishMetadataFromURI(contractId);

  let img = publishMetadata.data?.image;
  if (typeof img === "string" && img in FeatureIconMap) {
    img = FeatureIconMap[img as keyof typeof FeatureIconMap];
  }

  const isStaticImage = img && typeof img !== "string";

  return (
    <Skeleton isLoaded={publishMetadata.isSuccess}>
      {isStaticImage ? (
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
