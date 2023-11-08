import { Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsTerminal } from "react-icons/bs";
import { LinkButton, LinkButtonProps } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";
import { useEVMContractInfo } from "@3rdweb-sdk/react";
interface BuildAppsButtonProps extends Omit<LinkButtonProps, "href"> {}

export const BuildAppsButton: ComponentWithChildren<BuildAppsButtonProps> = ({
  children,
  ...restButtonProps
}) => {
  const { asPath } = useRouter();

  const getPath = () => {
    const contractInfo = useEVMContractInfo();
    if (!contractInfo) {
      return null;
    }

    const { contractAddress: address, chainSlug: network } = contractInfo;

    if (!address || !network) {
      return null;
    }

    return `/${network}/${address}/code`;
  };

  const path = getPath();
  if (!path) {
    return null;
  }

  if (asPath.includes("code")) {
    return null;
  }

  return (
    <LinkButton
      minW="inherit"
      variant="solid"
      bg="bgBlack"
      color="bgWhite"
      _hover={{
        opacity: 0.85,
      }}
      _active={{
        opacity: 0.75,
      }}
      leftIcon={<Icon as={BsTerminal} />}
      {...restButtonProps}
      href={path}
    >
      {children}
    </LinkButton>
  );
};
