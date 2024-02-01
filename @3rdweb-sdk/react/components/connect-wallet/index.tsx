import { popularChains } from "../popularChains";
import { useColorMode, Flex, Spacer, Box } from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { ChakraNextImage } from "components/Image";
import { CustomChainRenderer } from "components/selects/CustomChainRenderer";
import {
  useAddRecentlyUsedChainId,
  useRecentlyUsedChains,
} from "hooks/chains/recentlyUsedChains";
import { useSetIsNetworkConfigModalOpen } from "hooks/networkConfigModal";
import { ComponentProps } from "react";

import { ButtonProps, Text, Heading, TrackedLink } from "tw-components";

export interface ConnectWalletProps extends ButtonProps {
  shrinkMobile?: boolean;
  upsellTestnet?: boolean;
  onChainSelect?: (chainId: number) => void;
  auth?: ComponentProps<typeof ConnectWallet>["auth"];
}

export const CustomConnectWallet: React.FC<ConnectWalletProps> = ({ auth }) => {
  const { colorMode } = useColorMode();
  const recentChains = useRecentlyUsedChains();
  const addRecentlyUsedChainId = useAddRecentlyUsedChainId();
  const setIsNetworkConfigModalOpen = useSetIsNetworkConfigModalOpen();

  return (
    <ConnectWallet
      auth={auth}
      theme={colorMode}
      welcomeScreen={() => {
        return <ConnectWalletWelcomeScreen theme={colorMode} />;
      }}
      termsOfServiceUrl="/tos"
      privacyPolicyUrl="/privacy"
      hideTestnetFaucet={false}
      networkSelector={{
        popularChains,
        recentChains,
        onSwitch(chain) {
          addRecentlyUsedChainId(chain.chainId);
        },
        onCustomClick() {
          setIsNetworkConfigModalOpen(true);
        },
        renderChain: CustomChainRenderer,
      }}
    />
  );
};

export function ConnectWalletWelcomeScreen(props: {
  theme: "light" | "dark";
  subtitle?: string;
}) {
  const fontColor = props.theme === "light" ? "black" : "white";
  const subtitle = props.subtitle ?? "Connect your wallet to get started";

  return (
    <Flex
      h="full"
      backgroundColor={props.theme === "dark" ? "#18132f" : "#c7b5f1"}
      backgroundImage={`url("/assets/connect-wallet/welcome-gradient-${props.theme}.png")`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      flexDirection="column"
      p={6}
    >
      <Flex flexGrow={1} flexDirection="column" justifyContent="center">
        <Box>
          <Flex justifyContent={"center"}>
            <ChakraNextImage
              userSelect="none"
              draggable={false}
              width={200}
              height={150}
              alt=""
              src={require("public/assets/connect-wallet/tw-welcome-icon.svg")}
              mixBlendMode={props.theme === "dark" ? "soft-light" : "initial"}
            />
          </Flex>

          <Spacer h={10} />
          <Heading size="title.sm" color={fontColor} textAlign="center">
            Welcome to thirdweb
          </Heading>
          <Spacer h={4} />
          <Text
            color={fontColor}
            fontSize={16}
            opacity={0.8}
            fontWeight={500}
            textAlign="center"
          >
            {subtitle}
          </Text>
        </Box>
      </Flex>

      <TrackedLink
        textAlign="center"
        category="custom-connect-wallet"
        label="new-to-wallets"
        href="https://blog.thirdweb.com/web3-wallet/"
        isExternal
        fontWeight={500}
        fontSize={16}
        color={fontColor}
        opacity={0.7}
        _hover={{
          opacity: 1,
          textDecoration: "none",
        }}
      >
        New to Wallets?
      </TrackedLink>
    </Flex>
  );
}
