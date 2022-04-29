import { useContractPublishMetadataFromURI } from "../../hooks";
import { ContractId, DeployableContractContractCellProps } from "../../types";
import { Image, Skeleton } from "@chakra-ui/react";
import { ChakraNextImage, ChakraNextImageProps } from "components/Image";

export const ContractImageCell: React.VFC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  return <ContractIdImage contractId={value} />;
};

interface ContractIdImageProps
  extends Omit<ChakraNextImageProps, "src" | "alt"> {
  contractId: ContractId;
}

export const ContractIdImage: React.VFC<ContractIdImageProps> = ({
  contractId,
  boxSize = 8,
  ...imgProps
}) => {
  const publishMetadata = useContractPublishMetadataFromURI(contractId);

  const img = publishMetadata.data?.image;

  const isStaticImage = img && typeof img !== "string";

  return (
    <Skeleton isLoaded={publishMetadata.isSuccess}>
      {isStaticImage ? (
        <ChakraNextImage
          {...imgProps}
          boxSize={boxSize}
          src={img}
          alt={publishMetadata.data?.name || "Contract Image"}
        />
      ) : (
        <Image
          {...imgProps}
          boxSize={boxSize}
          src={img}
          alt={publishMetadata.data?.name || "Contract Image"}
        />
      )}
    </Skeleton>
  );
};
