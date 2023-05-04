import styled from "@emotion/styled";
import { EnvelopeClosedIcon, ChatBubbleIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { EmailConnect } from "./EmailConnect";
import { Theme } from "@emotion/react";
import { Img } from "../../../components/Img";
import { Spacer } from "../../../components/Spacer";
import { Flex } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { ErrorMessage } from "../../../components/formElements";
import {
  BackButton,
  ModalTitle,
  ModalDescription,
} from "../../../components/modalElements";
import { iconSize, spacing } from "../../../design-system";
import { ConnectUIProps } from "@thirdweb-dev/react-core";
import { MagicLinkWallet } from "./types";
import { SMSConnect } from "./SMSConnect";

type MagicConnectUIProps = ConnectUIProps & {
  magicWallet: MagicLinkWallet;
};

export const MagicConnectUI = (props: MagicConnectUIProps) => {
  const isSmsEnabled = props.magicWallet.config.smsLogin !== false;
  const isEmailEnabled = props.magicWallet.config.emailLogin !== false;

  let firstScreen: "sms" | "email" | "menu" = "menu";
  if (isEmailEnabled && !isSmsEnabled) {
    firstScreen = "email";
  } else if (isSmsEnabled && !isEmailEnabled) {
    firstScreen = "sms";
  }

  // const createInstance = useCreateWalletInstance();
  // const twContext = useThirdwebWallet();
  // const [isConnecting, setIsConnecting] = useState(false);
  const [showUI, setShowUI] = useState<"sms" | "email" | "menu">(firstScreen);

  // const handleAuthConnect = async (oauthProvider: MagicOAuthProvider) => {
  //   const magicWallet = createInstance(magicLinkObj) as MagicLink;
  //   setIsConnecting(true);
  //   await magicWallet.connect({
  //     oauthProvider: oauthProvider,
  //   });
  //   setIsConnecting(false);
  //   twContext.handleWalletConnect(magicWallet);
  //   props.onConnect();
  // };

  if (showUI === "sms") {
    return (
      <SMSConnect
        magicLinkWallet={props.magicWallet}
        onBack={() => {
          if (firstScreen === "sms") {
            props.goBack();
          } else {
            setShowUI(firstScreen);
          }
        }}
        onConnect={props.onConnect}
      />
    );
  }

  if (showUI === "email") {
    return (
      <EmailConnect
        magicLinkWallet={props.magicWallet}
        onBack={() => {
          if (firstScreen === "email") {
            props.goBack();
          } else {
            setShowUI(firstScreen);
          }
        }}
        onConnect={props.onConnect}
      />
    );
  }

  // if (isConnecting) {
  //   return (
  //     <Flex
  //       justifyContent="center"
  //       alignItems="center"
  //       style={{
  //         height: "350px",
  //       }}
  //     >
  //       <Spinner color="primary" size="lg" />
  //     </Flex>
  //   );
  // }

  // const authButton = (oauthProvider: MagicOAuthProvider) => (
  //   <IconButton
  //     variant="secondary"
  //     onClick={() => handleAuthConnect(oauthProvider)}
  //     aria-label={oauthProvider}
  //   >
  //     <Img
  //       src={authProviderImages[oauthProvider]}
  //       width={iconSize.lg}
  //       height={iconSize.lg}
  //     />
  //   </IconButton>
  // );

  return (
    <>
      <BackButton onClick={props.goBack}></BackButton>
      <Spacer y="md" />
      <Img
        src={props.magicWallet.meta.iconURL}
        width={iconSize.xl}
        height={iconSize.xl}
      />
      <Spacer y="md" />
      <ModalTitle> Magic Link </ModalTitle>
      <Spacer y="sm" />
      <ModalDescription>
        {isSmsEnabled &&
          isEmailEnabled &&
          "Login with your phone number or email"}
        {isSmsEnabled && !isEmailEnabled && "Login with your phone number"}
        {!isSmsEnabled && isEmailEnabled && "Login with your email"}
      </ModalDescription>

      <Spacer y="xl" />

      <Flex flexDirection="column" gap="sm">
        {/* sms */}
        {isSmsEnabled && (
          <LoginButton
            variant="secondary"
            onClick={() => {
              setShowUI("sms");
            }}
          >
            Phone number
            <ChatBubbleIcon
              width={iconSize.md}
              height={iconSize.md}
              style={{
                marginLeft: "auto",
              }}
            />
          </LoginButton>
        )}

        {/* Email */}
        {isEmailEnabled && (
          <LoginButton
            variant="secondary"
            onClick={() => {
              setShowUI("email");
            }}
          >
            Email
            <EnvelopeClosedIcon
              width={iconSize.md}
              height={iconSize.md}
              style={{
                marginLeft: "auto",
              }}
            />
          </LoginButton>
        )}

        {!isEmailEnabled && !isSmsEnabled && (
          <ErrorMessage> No login methods enabled </ErrorMessage>
        )}
      </Flex>

      <Spacer y="xl" />

      {/* <Flex gap="sm" justifyContent="flex-end">
        {authButton("google")}
        {authButton("twitter")}
        {authButton("github")}
        {authButton("microsoft")}
      </Flex> */}
    </>
  );
};

const LoginButton = styled(Button)<{ theme?: Theme }>`
  width: 100%;
  gap: ${spacing.md};
  justify-content: left;
  &:hover {
    background-color: ${(p) => p.theme.bg.elevatedHover};
  }
`;

// const authProviderImages: Record<MagicOAuthProvider, string> = {
//   google: "ipfs://QmNMm6313vpMxbyTcXyZMSEVMkpTvkmJXaqCyFrM5TDQpV/google.svg",
//   twitter: "ipfs://QmbUePooAWJbY1ZbzamAb36WJkuNCDzKxuFh4ZUbrepLud/twitter.svg",
//   apple: "",
//   bitbucket: "",
//   discord: "",
//   facebook: "",
//   github:
//     "ipfs://QmVN2Jaz4XGpEdqo9Ki16TJmxxhiiXDaG4kP18uXpGrJQA/github-gray.svg",
//   gitlab: "",
//   linkedin: "",
//   microsoft:
//     "ipfs://QmX4Nk5VW4tJVFstnEgXvZBdx5uVDz3Si662nhVNpWUFai/microsoft.svg",
//   twitch: "",
// };
