import {
  ens,
  useContractPrePublishMetadata,
  useContractPublishMetadataFromURI,
} from "../hooks";
import { ContractId } from "../types";
import { Image, Skeleton } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { ChakraNextImage, ChakraNextImageProps } from "components/Image";
import { StorageSingleton } from "components/app-layouts/providers";
import { FeatureIconMap } from "constants/mappings";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { StaticImageData } from "next/image";

export interface ContractIdImageProps
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
  const wallet = useSingleQueryParam("networkOrAddress");

  const ensQuery = ens.useQuery(wallet);
  const fullPublishMetadata = useContractPrePublishMetadata(
    contractId,
    ensQuery.data?.address || wallet || address,
  );
  const publishMetadata = useContractPublishMetadataFromURI(contractId);

  const logo =
    fullPublishMetadata.data?.latestPublishedContractMetadata?.publishedMetadata
      .logo;

  let img = publishMetadata.data?.image;
  if (typeof img === "string" && img in FeatureIconMap) {
    img = FeatureIconMap[img as keyof typeof FeatureIconMap];
  }
  const isStaticImage = img && typeof img !== "string";

  return (
    <Skeleton isLoaded={publishMetadata.isSuccess}>
      {logo ? (
        <Image
          boxSize={boxSize}
          src={logo.replace("ipfs://", `${StorageSingleton.gatewayUrl}/`)}
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
