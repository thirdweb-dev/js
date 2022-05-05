import { FeatureDrawerContent } from "./feature-drawer";
import { CloseButton, Flex, useDisclosure } from "@chakra-ui/react";
import { FeatureWithEnabled } from "@thirdweb-dev/sdk/dist/src/constants/contract-features";
import {
  Button,
  ButtonProps,
  Drawer,
  Heading,
  LinkButton,
} from "tw-components";

interface FeatureButtonProps extends ButtonProps {
  features: FeatureWithEnabled[];
}

export const FeatureButton: React.VFC<FeatureButtonProps> = ({
  features,
  ...restProps
}) => {
  const drawerState = useDisclosure();
  return (
    <>
      <Drawer
        {...drawerState}
        size="lg"
        hideCloseButton
        header={{
          children: (
            <Flex direction="row" align="center" justify="space-between">
              <Heading>Contract Features</Heading>
              <Flex align="center" gap={4}>
                <LinkButton href="https://docs.thirdweb.com" isExternal>
                  Learn More
                </LinkButton>
                <CloseButton onClick={drawerState.onClose} />
              </Flex>
            </Flex>
          ),
        }}
      >
        <FeatureDrawerContent features={features} />
      </Drawer>
      <Button {...restProps} onClick={drawerState.onOpen} />
    </>
  );
};
