import { useWallet, useWalletConnectHandler } from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "../../components/basic";
import { LockIcon } from "./icons/LockIcon";
import { fontSize, iconSize, radius, spacing } from "../../design-system";
import { useCustomTheme } from "../../design-system/CustomThemeProvider";
import { StyledButton } from "../../design-system/elements";
import {
  ArrowRightIcon,
  CornersIcon,
  DiscIcon,
  EnterIcon,
} from "@radix-ui/react-icons";
import { Img } from "../../components/Img";
import { walletConnectIcon } from "./icons/dataUris";
import { useTWLocale } from "../../evm/providers/locale-provider";
import { Button, IconButton } from "../../components/buttons";
import styled from "@emotion/styled";
import { ExitIcon } from "./icons/ExitIcon";
import { Input } from "../../components/formElements";

const ConnectAppField = ({
  onConnectAppTriggered,
}: {
  onConnectAppTriggered?: () => void;
}) => {
  const locale = useTWLocale().connectWallet;
  const [showWCInput, setShowWCInput] = useState(false);
  const [wcUri, setWCUri] = useState<string | undefined>();
  const [appMeta, setAppMeta] = useState<{ name: string; iconUrl: string }>();
  const wallet = useWallet();
  const [showQRCodeScan, setShowQRCodeScan] = useState(false);
  const wcUriRef = useRef<string | undefined>();
  const walletConnectHandler = useWalletConnectHandler();

  const getAppMeta = useCallback(() => {
    const sessions = walletConnectHandler?.getActiveSessions();
    if (sessions && Object.keys(sessions).length > 0) {
      setAppMeta({
        name: sessions[0].peer.metadata.name,
        iconUrl: sessions[0].peer.metadata.icons[0],
      });
    }
  }, [walletConnectHandler]);

  const onWalletConnectMessage = useCallback(
    ({ type }: { type: string }) => {
      if (type === "session_approved") {
        getAppMeta();
      } else if (type === "session_delete") {
        reset();
      }
    },
    [getAppMeta],
  );

  useEffect(() => {
    if (wallet) {
      wallet.addListener("message", onWalletConnectMessage);

      getAppMeta();
    }

    return () => {
      if (wallet) {
        wallet.removeListener("message", onWalletConnectMessage);
      }
    };
  }, [getAppMeta, onWalletConnectMessage, wallet]);

  const onConnectDappPress = () => {
    if (appMeta) {
      reset();
      walletConnectHandler?.disconnectSession();
    } else {
      setShowWCInput(true);
    }
  };

  const reset = () => {
    setAppMeta(undefined);
    setShowWCInput(false);
  };

  const onAddressChangeText = (text: string) => {
    setWCUri(text);
  };

  const onQRCodeScan = (data: string) => {
    if (wcUriRef.current !== data && data.startsWith("wc:")) {
      wcUriRef.current = data;
      setWCUri(data);
      setShowQRCodeScan(false);

      onWCPress(data);
    }
  };

  const onQRClose = () => {
    setShowQRCodeScan(false);
  };

  const onWCPress = (uri?: string) => {
    console.log("onWCPress", wcUri, uri);
    if (!(wcUri || uri) || !wallet) {
      return;
    }

    const uriToUse = uri || wcUri;

    if (!uriToUse?.startsWith("wc:")) {
      return;
    }

    console.log("onWCPress", uriToUse);

    onConnectAppTriggered?.();

    console.log("walletConnectHandler", !!walletConnectHandler);
    walletConnectHandler?.connectApp(uriToUse);

    setWCUri(undefined);
    wcUriRef.current = undefined;
  };

  const onScanQRPress = () => {
    setShowQRCodeScan(true);
  };

  return (
    <MenuButton
      type="button"
      onClick={onConnectDappPress}
      style={{
        fontSize: fontSize.sm,
      }}
    >
      {!appMeta && showWCInput ? (
        <>
          <Container expand>
            <Input
              // data-error={showInvalidAddressError}
              required
              id="receiever"
              placeholder={"wc://..."}
              variant="outline"
              value={wcUri}
              onChange={(e) => {
                onAddressChangeText(e.target.value);
              }}
            />
          </Container>
          <Button
            variant="accent"
            onClick={() => onWCPress()}
            data-test="sign-in-button"
          >
            <ArrowRightIcon width={iconSize.sm} height={iconSize.sm} />
          </Button>
        </>
      ) : (
        <>
          <Container color="secondaryText">
            <Img
              width={iconSize.md}
              height={iconSize.md}
              src={appMeta?.iconUrl ? appMeta?.iconUrl : walletConnectIcon}
              alt=""
              style={{
                borderRadius: radius.sm,
              }}
            />
          </Container>
          {appMeta ? appMeta.name : locale.agreement.privacyPolicy}
          {appMeta && (
            <DisconnectIconButton type="button" onClick={() => {}}>
              <ExitIcon size={iconSize.sm} />
            </DisconnectIconButton>
          )}
        </>
      )}
    </MenuButton>
  );

  //   return (
  //     <>
  //       {!appMeta && showWCInput ? (
  //         <Box
  //           flexDirection="row"
  //           mt="xs"
  //           borderColor="border"
  //           borderWidth={1}
  //           borderRadius="md"
  //         >
  //           <TextInput
  //             textInputProps={{
  //               onChangeText: onAddressChangeText,
  //               value: wcUri,
  //               placeholder: "wc://...",
  //               placeholderTextColor: theme.colors.textSecondary,
  //               numberOfLines: 1,
  //               style: {
  //                 color: theme.colors.textPrimary,
  //                 fontFamily: theme.textVariants.defaults.fontFamily,
  //                 flex: 1,
  //               },
  //             }}
  //             containerProps={{
  //               flex: 1,
  //               pl: "xxs",
  //             }}
  //           />
  //           <BaseButton
  //             onPress={() => onWCPress()}
  //             justifyContent="center"
  //             alignItems="center"
  //           >
  //             <RightArrowIcon
  //               height={20}
  //               width={30}
  //               color={theme.colors.iconPrimary}
  //             />
  //           </BaseButton>
  //           <BaseButton
  //             onPress={onScanQRPress}
  //             justifyContent="center"
  //             alignItems="center"
  //             marginHorizontal="xs"
  //           >
  //             <QrCodeIcon
  //               height={30}
  //               width={30}
  //               color={theme.colors.iconPrimary}
  //             />
  //           </BaseButton>
  //         </Box>
  //       ) : (
  //         <BaseButton
  //           backgroundColor="background"
  //           borderColor="border"
  //           mt="xs"
  //           justifyContent="space-between"
  //           style={styles.exportWallet}
  //           onPress={onConnectDappPress}
  //         >
  //           <>
  //             {appMeta?.iconUrl ? (
  //               <WalletIcon size={24} iconUri={appMeta.iconUrl} />
  //             ) : (
  //               <WalletConnectIcon width={24} height={24} />
  //             )}
  //             <View style={styles.exportWalletInfo}>
  //               <Text variant="bodySmall" numberOfLines={1}>
  //                 {appMeta ? appMeta.name : l.common.connect_app}
  //               </Text>
  //             </View>
  //           </>
  //           {appMeta ? (
  //             <DisconnectIcon
  //               height={10}
  //               width={10}
  //               color={theme.colors.iconPrimary}
  //             />
  //           ) : (
  //             <RightArrowIcon
  //               height={10}
  //               width={10}
  //               color={theme.colors.iconPrimary}
  //             />
  //           )}
  //         </BaseButton>
  //       )}

  //       <QRCodeScan
  //         isVisible={showQRCodeScan}
  //         onQRCodeScan={onQRCodeScan}
  //         onClose={onQRClose}
  //       />
  //     </>
  //   );
};

const DisconnectIconButton = /* @__PURE__ */ styled(IconButton)(() => {
  const theme = useCustomTheme();
  return {
    marginRight: `-${spacing.xxs}`,
    marginLeft: "auto",
    color: theme.colors.secondaryText,
    "&:hover": {
      color: theme.colors.danger,
      background: "none",
    },
  };
});

const MenuButton = /* @__PURE__ */ StyledButton(() => {
  const theme = useCustomTheme();
  return {
    all: "unset",
    padding: `${spacing.sm} ${spacing.sm}`,
    borderRadius: radius.md,
    backgroundColor: "transparent",
    border: `1px solid ${theme.colors.borderColor}`,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    width: "100%",
    cursor: "pointer",
    fontSize: fontSize.md,
    fontWeight: 500,
    color: `${theme.colors.primaryText} !important`,
    gap: spacing.sm,
    WebkitTapHighlightColor: "transparent",
    lineHeight: 1.3,
    "&:not([disabled]):hover": {
      transition: "box-shadow 250ms ease, border-color 250ms ease",
      border: `1px solid ${theme.colors.accentText}`,
      boxShadow: `0 0 0 1px ${theme.colors.accentText}`,
    },
    "&[disabled]": {
      cursor: "not-allowed",
      svg: {
        display: "none",
      },
    },
    "&[disabled]:hover": {
      transition: "box-shadow 250ms ease, border-color 250ms ease",
      border: `1px solid ${theme.colors.danger}`,
      boxShadow: `0 0 0 1px ${theme.colors.danger}`,
    },
  };
});

export default ConnectAppField;
