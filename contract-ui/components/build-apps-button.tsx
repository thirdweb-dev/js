import { Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { BsTerminal } from "react-icons/bs";
import { LinkButton, LinkButtonProps } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface BuildAppsButtonProps extends Omit<LinkButtonProps, "href"> {}

export const BuildAppsButton: ComponentWithChildren<BuildAppsButtonProps> = ({
  children,
  ...restButtonProps
}) => {
  const { query } = useRouter();
  const path = useMemo(() => {
    const [network, address] = query.paths as string[];

    return `/${network}/${address}/code`;
  }, [query.paths]);

  return (
    <LinkButton
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
