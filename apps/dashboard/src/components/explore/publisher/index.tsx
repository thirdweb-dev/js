import { PublisherAvatar } from "components/contract-components/publisher/masked-avatar";
import Link from "next/link";
import { shortenIfAddress } from "utils/usedapp-external";
import { isEnsName, resolveEns } from "../../../lib/ens";

interface ContractPublisherProps {
  addressOrEns: string;
}

export const ContractPublisher: React.FC<ContractPublisherProps> = async ({
  addressOrEns,
}) => {
  let ensOrAddressToShow = addressOrEns;

  if (!isEnsName(addressOrEns)) {
    try {
      const res = await resolveEns(addressOrEns);
      if (res.ensName) {
        ensOrAddressToShow = res.ensName;
      }
    } catch {
      // ignore
    }
  }

  return (
    <Link
      className="flex shrink-0 items-center gap-1.5 hover:underline"
      href={replaceDeployerAddress(`/${ensOrAddressToShow}`)}
    >
      <PublisherAvatar
        isPending={false}
        className="size-5"
        address={addressOrEns || ""}
      />

      <p className="text-xs"> {treatAddress(ensOrAddressToShow)} </p>
    </Link>
  );
};

export function replaceDeployerAddress(address: string) {
  return (
    address
      .replace("deployer.thirdweb.eth", "thirdweb.eth")
      // deployer.thirdweb.eth
      .replace("0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024", "thirdweb.eth")
  );
}

export function treatAddress(address: string) {
  return shortenIfAddress(replaceDeployerAddress(address));
}
