import { SkeletonContainer } from "@/components/ui/skeleton";
import { useEns } from "components/contract-components/hooks";
import { PublisherAvatar } from "components/contract-components/publisher/masked-avatar";
import Link from "next/link";
import type { RequiredParam } from "utils/types";
import { shortenIfAddress } from "utils/usedapp-external";

interface ContractPublisherProps {
  addressOrEns: RequiredParam<string>;
  showSkeleton?: boolean;
}

export const ContractPublisher: React.FC<ContractPublisherProps> = ({
  addressOrEns,
  showSkeleton,
}) => {
  const ensQuery = useEns(addressOrEns || undefined);

  return (
    <Link
      className="gap-1.5 flex items-center shrink-0 hover:underline"
      href={replaceDeployerAddress(
        `/${ensQuery.data?.ensName || ensQuery.data?.address || addressOrEns}`,
      )}
    >
      <PublisherAvatar
        isLoading={showSkeleton}
        boxSize={5}
        address={addressOrEns || ""}
      />

      <SkeletonContainer
        loadedData={
          ensQuery.data?.ensName || ensQuery.data?.address || addressOrEns || ""
        }
        skeletonData=""
        render={(v) => <p className="text-xs"> {treatAddress(v)} </p>}
      />
    </Link>
  );
};

export function replaceDeployerAddress(address: string) {
  return address.replace("deployer.thirdweb.eth", "thirdweb.eth");
}

export function treatAddress(address: string) {
  return shortenIfAddress(replaceDeployerAddress(address));
}
