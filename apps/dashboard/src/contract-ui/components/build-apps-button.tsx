import { useEVMContractInfo } from "@3rdweb-sdk/react";
import { Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { BsTerminal } from "react-icons/bs";
import { LinkButton, type LinkButtonProps } from "tw-components";
import type { ComponentWithChildren } from "types/component-with-children";

type BuildAppsButtonProps = Omit<LinkButtonProps, "href">;

export const BuildAppsButton: ComponentWithChildren<BuildAppsButtonProps> = ({
  children,
  ...restButtonProps
}) => {
  const { asPath } = useRouter();

  const contractInfo = useEVMContractInfo();

  const path = useMemo(() => {
    if (!contractInfo?.chainSlug || !contractInfo?.contractAddress) {
      return null;
    }

    return `/${contractInfo.chainSlug}/${contractInfo.contractAddress}/code`;
  }, [contractInfo?.contractAddress, contractInfo?.chainSlug]);

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
