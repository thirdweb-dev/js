/* eslint-disable @next/next/no-img-element */

import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FetchDeployMetadataResult } from "thirdweb/contract";
import { DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/server-envs";
import { getConfiguredThirdwebClient } from "@/constants/thirdweb.server";
import { replaceIpfsUrl } from "@/lib/sdk";
import generalContractIcon from "../../../../../public/assets/tw-icons/general.png";

type ContractIdImageProps = {
  deployedMetadataResult: FetchDeployMetadataResult;
};

export const ContractIdImage: React.FC<ContractIdImageProps> = ({
  deployedMetadataResult,
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
        src={
          DASHBOARD_THIRDWEB_SECRET_KEY
            ? replaceIpfsUrl(
                logo,
                getConfiguredThirdwebClient({
                  secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
                  teamId: undefined,
                }),
              )
            : logo
        }
      />
    );
  }

  if (typeof img !== "string") {
    return <Image alt={""} className="size-8" src={img as StaticImageData} />;
  }

  return <img alt={""} className="size-8" src={img} />;
};
