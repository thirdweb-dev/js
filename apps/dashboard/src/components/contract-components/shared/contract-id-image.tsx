/* eslint-disable @next/next/no-img-element */
import { replaceIpfsUrl } from "lib/sdk";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { ThirdwebClient } from "thirdweb";
import type { FetchDeployMetadataResult } from "thirdweb/contract";
import generalContractIcon from "../../../../public/assets/tw-icons/general.png";

type ContractIdImageProps = {
  deployedMetadataResult: FetchDeployMetadataResult;
  client: ThirdwebClient;
};

export const ContractIdImage: React.FC<ContractIdImageProps> = ({
  deployedMetadataResult,
  client,
}) => {
  const logo = deployedMetadataResult.logo;

  const img =
    deployedMetadataResult.image !== "custom"
      ? deployedMetadataResult.image || generalContractIcon
      : generalContractIcon;

  if (logo) {
    return (
      <img
        alt=""
        className="size-8 rounded-full"
        src={replaceIpfsUrl(logo, client)}
      />
    );
  }

  if (typeof img !== "string") {
    return <Image className="size-8" src={img as StaticImageData} alt={""} />;
  }

  return <img className="size-8" src={img} alt={""} />;
};
