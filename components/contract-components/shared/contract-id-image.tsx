import {
  ens,
  useContractPrePublishMetadata,
  useContractPublishMetadataFromURI,
  useReleaserProfile,
} from "../hooks";
import { MaskedAvatar } from "../releaser/masked-avatar";
import { ContractId } from "../types";
import { Image, Skeleton } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { ChakraNextImage, ChakraNextImageProps } from "components/Image";
import { FeatureIconMap } from "constants/mappings";
import { useSingleQueryParam } from "hooks/useQueryParam";
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
  const address = useAddress();
  const wallet = useSingleQueryParam("networkOrAddress");

  const ensQuery = ens.useQuery(wallet);
  const fullPublishMetadata = useContractPrePublishMetadata(
    contractId,
    ensQuery.data?.address || wallet || address,
  );
  const publishMetadata = useContractPublishMetadataFromURI(contractId);

  const publisher =
    fullPublishMetadata.data?.latestPublishedContractMetadata?.publishedMetadata
      .publisher;

  const releaserProfile = useReleaserProfile(publisher || undefined);
  let img = publishMetadata.data?.image;
  if (typeof img === "string" && img in FeatureIconMap) {
    img = FeatureIconMap[img as keyof typeof FeatureIconMap];
  }
  const isStaticImage = img && typeof img !== "string";

  return (
    <Skeleton isLoaded={publishMetadata.isSuccess}>
      {releaserProfile.data?.avatar ? (
        <MaskedAvatar boxSize={boxSize} src={releaserProfile.data.avatar} />
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
