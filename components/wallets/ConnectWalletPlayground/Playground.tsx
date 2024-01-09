/* eslint-disable inclusive-language/use-inclusive-words */
import {
  Box,
  Flex,
  GridItem,
  Input,
  Grid,
  useBreakpointValue,
  useColorMode,
  Spacer,
  Switch,
  Icon,
  Select,
  FormControl,
} from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import {
  Button,
  Heading,
  Text,
  FormLabel,
  CodeBlock,
  TrackedLink,
  ChakraNextLink,
} from "tw-components";
import { ChakraNextImage } from "components/Image";
import { format } from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { walletInfoRecord, WalletId } from "./walletInfoRecord";
import { getCode } from "./getCode";
import {
  RecommendedIconButton,
  SocialButton,
  WalletButton,
} from "./WalletButton";
import {
  ConnectModalInlinePreview,
  WelcomeScreen,
  useCanShowInlineModal,
} from "./ConnectModalInlinePreview";
import { FormItem } from "./FormItem";
import { SwitchFormItem } from "./SwitchFormItem";
import { AiOutlineStar, AiOutlineWarning } from "react-icons/ai";
import { ColorInput } from "./ColorInput";
import { BsStars } from "react-icons/bs";
import { ThemeButton } from "./ThemeButton";
import { ModalSizeButton } from "./ModalSizeButton";
import { PreviewThirdwebProvider } from "./PreviewThirdwebProvider";
import { usePlaygroundWallets } from "./usePlaygroundWallets";
import { usePlaygroundTheme } from "./usePlaygroundTheme";
import { useTrack } from "hooks/analytics/useTrack";

type OptionalUrl = { url: string; enabled: boolean };
export const ConnectWalletPlayground: React.FC<{
  trackingCategory: string;
}> = ({ trackingCategory }) => {
  const _trackEvent = useTrack();

  const trackCustomize = (input: string, data: Record<string, string> = {}) => {
    _trackEvent({
      action: "click",
      category: trackingCategory,
      label: "customize",
      input,
      ...data,
    });
  };

  const defaultOptionalUrl: OptionalUrl = {
    enabled: false,
    url: "",
  };

  const [tabToShow, setTabToShow] = useState<1 | 2 | 3>(1);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [btnTitle, setBtnTitle] = useState("");
  const [modalSize, setModalSize] = useState<"compact" | "wide">("wide");
  const [modalTitle, setModalTitle] = useState("");
  const [tosUrl, setTosUrl] = useState<OptionalUrl>(defaultOptionalUrl);
  const [privacyPolicyUrl, setPrivacyPolicyUrl] =
    useState<OptionalUrl>(defaultOptionalUrl);
  const [modalTitleIconUrl, setModalTitleIconUrl] =
    useState<OptionalUrl>(defaultOptionalUrl);
  const [welcomeScreen, setWelcomeScreen] = useState<WelcomeScreen>({});

  const { colorMode, toggleColorMode } = useColorMode();
  const selectedTheme = colorMode === "light" ? "light" : "dark";
  const [authEnabled, setAuthEnabled] = useState(false);
  const [switchToActiveChain, setSwitchToActiveChain] = useState(false);
  const [locale, setLocale] = useState<"en" | "ja" | "es">("en");
  const [code, setCode] = useState("");

  const { colorOverrides, themeObj, setColorOverrides } =
    usePlaygroundTheme(selectedTheme);

  const {
    walletSelection,
    setWalletSelection,
    enabledWallets,
    smartWalletOptions,
    setSmartWalletOptions,
    supportedWallets,
    socialOptions,
    setSocialOptions,
  } = usePlaygroundWallets({
    MetaMask: true,
    Coinbase: "recommended",
    WalletConnect: true,
    Safe: false,
    "Guest Mode": true,
    "Email Wallet": true,
    Trust: false,
    Zerion: false,
    Blocto: false,
    "Magic Link": false,
    Frame: false,
    Rainbow: false,
    Phantom: false,
  });

  useEffect(() => {
    const getSupportedWalletsCode = (walletIds: WalletId[]): string => {
      return `[${walletIds
        .map((walletId) => {
          const recommended = walletInfoRecord[walletId].component.recommended;
          let walletCode = walletInfoRecord[walletId].code(recommended);

          if (walletId === "Safe") {
            const personalWalletIds = walletIds.filter((w) => w !== "Safe");
            if (personalWalletIds.length === 0) {
              return recommended
                ? `safeWallet({ recommended: true })`
                : `safeWallet()`;
            }
            return `safeWallet({
              ${recommended ? "recommended: true," : ""}
              personalWallets: ${getSupportedWalletsCode(
                walletIds.filter((w) => w !== "Safe"),
              )}
            })`;
          }

          if (walletId === "Email Wallet") {
            if (!recommended && !socialOptions.length) {
              walletCode = `embeddedWallet()`;
            } else {
              const options: Record<string, any> = {};
              if (recommended) {
                options.recommended = true;
              }
              if (socialOptions.length) {
                options.auth = {
                  options: socialOptions,
                };
              }

              walletCode = `embeddedWallet(${JSON.stringify(
                options,
                null,
                2,
              )})`;
            }
          }

          return smartWalletOptions.enabled
            ? `smartWallet(${walletCode}, smartWalletOptions)`
            : walletCode;
        })
        .join(",")}]`;
    };

    const _code = getCode({
      baseTheme: selectedTheme,

      colorOverrides,
      imports: enabledWallets.map(
        (walletId) => walletInfoRecord[walletId].import,
      ),
      smartWalletOptions: smartWalletOptions.enabled
        ? {
            gasless: smartWalletOptions.gasless,
          }
        : undefined,
      thirdwebProvider: {
        locale: `${locale}()`,
        supportedWallets:
          enabledWallets.length > 0
            ? getSupportedWalletsCode(enabledWallets)
            : undefined,
        authConfig: authEnabled
          ? `{ authUrl: "/api/auth", domain: "https://example.com" }`
          : undefined,
      },
      connectWallet: {
        theme: `"${selectedTheme}"`,
        btnTitle: btnTitle ? `"${btnTitle}"` : undefined,
        modalTitle: modalTitle ? `"${modalTitle}"` : undefined,
        auth: authEnabled ? "{ loginOptional: false }" : undefined,
        switchToActiveChain: switchToActiveChain ? "true" : undefined,
        modalSize: `"${modalSize}"`,
        welcomeScreen:
          Object.keys(welcomeScreen).length > 0
            ? JSON.stringify(welcomeScreen)
            : undefined,
        modalTitleIconUrl: modalTitleIconUrl.enabled
          ? `"${modalTitleIconUrl.url}"`
          : undefined,
        termsOfServiceUrl: tosUrl.enabled ? `"${tosUrl.url}"` : undefined,
        privacyPolicyUrl: privacyPolicyUrl.enabled
          ? `"${privacyPolicyUrl.url}"`
          : undefined,
      },
    });

    format(_code, {
      parser: "babel",
      plugins: [parserBabel, estree],
      printWidth: 50,
    }).then((formattedCode) => {
      setCode(formattedCode);
    });
  }, [
    authEnabled,
    btnTitle,
    enabledWallets,
    modalTitle,
    selectedTheme,
    switchToActiveChain,
    modalSize,
    smartWalletOptions,
    modalTitleIconUrl,
    welcomeScreen,
    colorOverrides,
    tosUrl,
    privacyPolicyUrl,
    locale,
    socialOptions,
  ]);

  const welcomeScreenContent = (
    <Flex direction="column" gap={5}>
      <Heading size="label.lg" as="h3" color="faded">
        Welcome Screen
      </Heading>

      {/* Welcome Screen Title */}
      <FormItem label="Title">
        <Input
          onClick={() => {
            trackCustomize("welcome-screen-title");
          }}
          placeholder="Your gateway to the decentralized world"
          value={welcomeScreen.title}
          onChange={(e) => {
            setWelcomeScreen({
              ...welcomeScreen,
              title: e.target.value,
            });
          }}
        />
      </FormItem>

      {/* Welcome Screen Subtitle */}
      <FormItem label="Subtitle">
        <Input
          onClick={() => {
            trackCustomize("welcome-screen-subtitle");
          }}
          placeholder="Connect a wallet to get started"
          value={welcomeScreen.subtitle}
          onChange={(e) => {
            setWelcomeScreen({
              ...welcomeScreen,
              subtitle: e.target.value,
            });
          }}
        />
      </FormItem>

      {/* Welcome Screen Image */}
      <FormItem
        label="Splash Image"
        addOn={
          <Flex gap={3} alignItems="center">
            <Text>{welcomeScreen.img ? "Custom" : "Default"}</Text>
            <Switch
              size="lg"
              isChecked={!!welcomeScreen.img}
              onChange={() => {
                trackCustomize("splash-image-switch");
                setWelcomeScreen({
                  ...welcomeScreen,
                  img: welcomeScreen.img
                    ? undefined
                    : {
                        src: "",
                        width: 150,
                        height: 150,
                      },
                });
              }}
            />
          </Flex>
        }
      >
        {welcomeScreen.img && (
          <Flex flexDir="column" gap={3}>
            <Box>
              <FormLabel m={0} mb={2}>
                Image Address
              </FormLabel>
              <Input
                onClick={() => {
                  trackCustomize("splash-image-url");
                }}
                placeholder="https://..."
                value={welcomeScreen.img.src || ""}
                onChange={(e) => {
                  setWelcomeScreen({
                    ...welcomeScreen,
                    img: {
                      ...welcomeScreen.img,
                      src: e.target.value,
                    },
                  });
                }}
              />
            </Box>

            <Grid gap={2} templateColumns="1fr 1fr">
              <Box>
                <FormLabel m={0} mb={2}>
                  width
                </FormLabel>
                <Input
                  onClick={() => {
                    trackCustomize("splash-image-width");
                  }}
                  placeholder="150"
                  value={welcomeScreen.img.width}
                  onChange={(e) => {
                    setWelcomeScreen({
                      ...welcomeScreen,
                      img: {
                        src: welcomeScreen.img?.src || "",
                        ...welcomeScreen.img,
                        width: Number(e.target.value),
                      },
                    });
                  }}
                />
              </Box>

              <Box>
                <FormLabel m={0} mb={2}>
                  height
                </FormLabel>
                <Input
                  onClick={() => {
                    trackCustomize("splash-image-height");
                  }}
                  placeholder="150"
                  value={welcomeScreen.img.height}
                  onChange={(e) => {
                    setWelcomeScreen({
                      ...welcomeScreen,
                      img: {
                        src: welcomeScreen.img?.src || "",
                        ...welcomeScreen.img,
                        height: Number(e.target.value),
                      },
                    });
                  }}
                />
              </Box>
            </Grid>
          </Flex>
        )}
      </FormItem>
    </Flex>
  );

  const socialLoginMethods = [
    {
      name: "Sign in with Email",
      key: "email",
    },
    {
      name: "Sign in with Google",
      key: "google",
    },
    {
      name: "Sign in with Apple",
      key: "apple",
    },
    {
      name: "Sign in with Facebook",
      key: "facebook",
    },
  ] as const;

  const socialLogins = (
    <>
      <Flex justifyContent={"space-between"}>
        <Flex gap={3} alignItems="center">
          <Heading size="label.md" color="heading">
            Email & Social Logins
          </Heading>
          <RecommendedIconButton
            onClick={() => {
              const current = walletSelection["Email Wallet"];
              const newState = current === "recommended" ? true : "recommended";

              if (newState === "recommended") {
                trackCustomize("recommend-wallet", {
                  walletName: "Embedded Wallet",
                });
              }

              setWalletSelection({
                ...walletSelection,
                "Email Wallet":
                  current === "recommended" ? true : "recommended",
              });
            }}
            isRecommended={walletSelection["Email Wallet"] === "recommended"}
          />
        </Flex>

        <Switch
          size="lg"
          isChecked={!!walletSelection["Email Wallet"]}
          onChange={() => {
            trackCustomize("wallet", {
              walletName: "Embedded Wallet",
            });

            setWalletSelection({
              ...walletSelection,
              "Email Wallet": !walletSelection["Email Wallet"],
            });
          }}
        />
      </Flex>

      <Spacer height={3} />
      <Grid
        gap={2}
        flexDir="column"
        templateColumns="1fr"
        opacity={walletSelection["Email Wallet"] ? 1 : 0.4}
        pointerEvents={walletSelection["Email Wallet"] ? "auto" : "none"}
      >
        {socialLoginMethods.map((x) => {
          return (
            <SocialButton
              key={x.key}
              icon={x.key}
              name={x.name}
              isSelected={socialOptions.includes(x.key)}
              onClick={() => {
                trackCustomize("socialLogin", {
                  option: x.key,
                });

                // do not allow to unselect all
                if (socialOptions.length === 1 && socialOptions[0] === x.key) {
                  return;
                }
                setSocialOptions(addOrRemoveFromList(socialOptions, x.key));
              }}
            />
          );
        })}
      </Grid>
    </>
  );

  const eoalWallets = (
    <>
      <Heading size="label.md" color="heading">
        Web3 Wallets
      </Heading>

      <Spacer height={2} />

      <Flex color="faded" alignItems="center" gap={1} fontSize={14}>
        Click on <Icon as={AiOutlineStar} w={4} h={4} color="faded" /> to tag
        wallet as recommended
      </Flex>

      <Spacer height={3} />
      <Grid gap={2} flexDir="column" templateColumns="1fr 1fr">
        {(Object.keys(walletInfoRecord) as WalletId[])
          .filter((key) => walletInfoRecord[key].type === "eoa")
          .map((key) => {
            const walletId = key as WalletId;
            const walletInfo = walletInfoRecord[walletId];
            const selection = walletSelection[walletId];

            return (
              <WalletButton
                name={walletId}
                key={walletId}
                icon={walletInfo.component.meta.iconURL}
                onRecommendedClick={() => {
                  trackCustomize("recommend-wallet", {
                    walletName: walletId,
                  });

                  const current = selection;
                  setWalletSelection({
                    ...walletSelection,
                    [walletId]:
                      current === "recommended" ? true : "recommended",
                  });
                }}
                recommended={selection === "recommended"}
                isChecked={!!selection}
                onSelect={() => {
                  trackCustomize("wallet", {
                    walletName: walletId,
                  });

                  setWalletSelection({
                    ...walletSelection,
                    [walletId]: !selection,
                  });
                }}
              />
            );
          })}
      </Grid>
      <Spacer height={3} />

      <TrackedLink
        category={trackingCategory}
        label="build-wallet"
        href="https://portal.thirdweb.com/wallet/build-a-wallet"
        alignItems="center"
        color="blue.500"
        gap={1}
        isExternal
        fontSize={14}
        _hover={{
          color: "heading",
          textDecor: "none",
        }}
      >
        Don{`'t`} see the wallet you are looking for? <br />
        Integrate it with ConnectWallet
      </TrackedLink>
    </>
  );

  const walletIds = supportedWallets.map((x) => x.id) as WalletId[];
  const showInlineModal = useCanShowInlineModal(walletIds);

  const previewSection = (
    <Box>
      <Text color="faded">Live Preview</Text>
      <Spacer height={2} />
      <Box
        border="1px solid"
        borderColor="borderColor"
        minH="120px"
        borderRadius="md"
        display="flex"
        justifyContent="center"
        alignItems="center"
        onClick={() => {
          trackCustomize("live-preview");
        }}
      >
        <Box>
          <PreviewThirdwebProvider
            locale={locale}
            authEnabled={authEnabled}
            supportedWallets={supportedWallets}
          >
            <ConnectWallet
              modalSize={modalSize}
              modalTitle={modalTitle}
              theme={themeObj}
              btnTitle={btnTitle || undefined}
              modalTitleIconUrl={
                modalTitleIconUrl.enabled ? modalTitleIconUrl.url : undefined
              }
              auth={{ loginOptional: !authEnabled }}
              switchToActiveChain={switchToActiveChain}
              welcomeScreen={welcomeScreen}
              termsOfServiceUrl={tosUrl.enabled ? tosUrl.url : undefined}
              privacyPolicyUrl={
                privacyPolicyUrl.enabled ? privacyPolicyUrl.url : undefined
              }
            />
          </PreviewThirdwebProvider>
        </Box>
      </Box>

      <Spacer height={10} flexGrow={0} flexShrink={0} />

      {/* Modal UI */}
      <Box>
        <Text color="faded">Modal UI</Text>
        <Box height={2} />
        <PreviewThirdwebProvider
          locale={locale}
          authEnabled={authEnabled}
          supportedWallets={supportedWallets}
        >
          <ClientOnly
            ssr={null}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {showInlineModal && (
              <ConnectModalInlinePreview
                modalSize={modalSize}
                walletIds={supportedWallets.map((x) => x.id) as WalletId[]}
                modalTitle={modalTitle}
                theme={themeObj}
                welcomeScreen={welcomeScreen}
                modalTitleIconUrl={
                  modalTitleIconUrl.enabled ? modalTitleIconUrl.url : undefined
                }
                termsOfServiceUrl={tosUrl.enabled ? tosUrl.url : undefined}
                privacyPolicyUrl={
                  privacyPolicyUrl.enabled ? privacyPolicyUrl.url : undefined
                }
              />
            )}

            {!showInlineModal && (
              <Flex justifyContent="center" p={4}>
                <Box
                  textAlign="center"
                  bg="backgroundBody"
                  p={3}
                  border="1px solid"
                  borderColor="borderColor"
                  borderRadius="md"
                  maxW="400px"
                >
                  <Text mb={2}>
                    {" "}
                    Can not show Modal UI for selected configuration because it
                    triggers wallet connection{" "}
                  </Text>
                  <Text> See Live Preview instead </Text>
                </Box>
              </Flex>
            )}
          </ClientOnly>
        </PreviewThirdwebProvider>
      </Box>
    </Box>
  );

  const tab1 = (
    <Box>
      <Grid templateColumns="1fr 1fr">
        {/* modal size */}
        {!isMobile && (
          <FormItem label="Modal Size">
            <Flex gap={2}>
              <ModalSizeButton
                trackingCategory={trackingCategory}
                theme={selectedTheme}
                modalSize="wide"
                isSelected={modalSize === "wide"}
                onClick={() => {
                  setModalSize("wide");
                }}
              />

              <ModalSizeButton
                trackingCategory={trackingCategory}
                theme={selectedTheme}
                modalSize="compact"
                isSelected={modalSize === "compact"}
                onClick={() => {
                  setModalSize("compact");
                }}
              />
            </Flex>
          </FormItem>
        )}

        {/* Locale */}
        <FormControl>
          <Box flex={1}>
            <FormLabel m={0}> Localization </FormLabel>
          </Box>

          <Spacer height={3} />

          <Select
            _focus={{
              bg: "inputBg",
            }}
            value={locale}
            onChange={(e) => {
              setLocale(e.target.value as "en" | "ja" | "es");
            }}
          >
            <option value="en">English </option>
            <option value="ja">Japanese </option>
            <option value="es">Spanish </option>
          </Select>
        </FormControl>
      </Grid>

      <Spacer height={8} />

      {eoalWallets}
      <Spacer height={8} />
      {socialLogins}

      <Spacer height={5} />
      <Box borderTop="1px solid" borderColor="borderColor" />
      <Spacer height={5} />

      {/* Guest Mode */}
      <SwitchFormItem
        label="Continue as Guest"
        description="Access your app with a guest account"
        onCheck={(_isChecked) => {
          if (_isChecked) {
            trackCustomize("continue-as-guest");
          }
          setWalletSelection({
            ...walletSelection,
            "Guest Mode": _isChecked,
          });
        }}
        isChecked={!!walletSelection["Guest Mode"]}
      />

      <Spacer height={5} />
      <Box borderTop="1px solid" borderColor="borderColor" />
      <Spacer height={5} />

      {/* Smart wallet */}
      <SwitchFormItem
        label="Smart Wallets"
        description="Use ERC-4337 (Account Abstraction) compatible smart wallets. Enabling this will connect user to the associated smart wallet"
        onCheck={(_isChecked) => {
          if (_isChecked) {
            trackCustomize("smart-wallet");
          }
          setSmartWalletOptions({
            ...smartWalletOptions,
            enabled: _isChecked,
          });
        }}
        isChecked={enabledWallets.length > 0 && smartWalletOptions.enabled}
      />

      {enabledWallets.length === 0 && (
        <>
          <Spacer h={3} fontWeight={500} />
          <Flex alignItems="center" gap={2}>
            <Icon as={AiOutlineWarning} color="orange.500" />
            <Text color="orange.500">
              Enable at least one wallet to use smart wallet
            </Text>
          </Flex>
        </>
      )}

      <Spacer height={5} />
      <Box borderTop="1px solid" borderColor="borderColor" />
      <Spacer height={5} />

      <SwitchFormItem
        label="Auth"
        description="Enforce signatures (SIWE) after wallet connection"
        onCheck={(_isChecked) => {
          if (_isChecked) {
            trackCustomize("auth");
          }
          setAuthEnabled(_isChecked);
        }}
        isChecked={authEnabled}
      />

      <Spacer height={5} />
      <Box borderTop="1px solid" borderColor="borderColor" />
      <Spacer height={5} />

      <SwitchFormItem
        label="Switch to Active Chain"
        description="Prompt user to switch to activeChain set in ThirdwebProvider after wallet connection"
        onCheck={(_isChecked) => {
          if (_isChecked) {
            trackCustomize("switch-to-active-chain");
          }
          setSwitchToActiveChain(_isChecked);
        }}
        isChecked={switchToActiveChain}
      />

      <Spacer height={5} />
      <Box borderTop="1px solid" borderColor="borderColor" />
      <Spacer height={5} />
    </Box>
  );

  const tab2 = (
    <Box>
      <Flex direction="column" gap={5}>
        {/* Button Title */}
        <FormItem
          label="Button Title"
          description="Title of ConnectWallet button"
        >
          <Input
            onClick={() => {
              trackCustomize("button-title-input");
            }}
            placeholder="Connect Wallet"
            value={btnTitle}
            onChange={(e) => {
              setBtnTitle(e.target.value);
            }}
          />
        </FormItem>

        <Spacer height={10} />

        <Flex direction="column" gap={5}>
          <Heading size="label.lg" as="h3" color="faded">
            Modal
          </Heading>

          {/* Modal Title */}
          <FormItem label="Modal Title">
            <Input
              placeholder="Choose your wallet"
              value={modalTitle}
              onClick={() => {
                trackCustomize("modal-title-input");
              }}
              onChange={(e) => {
                setModalTitle(e.target.value);
              }}
            />
          </FormItem>

          {/* Modal Title Icon */}
          <FormItem
            label="Modal Title Icon"
            description="Icon to shown next to the modal title"
            addOn={
              <Flex gap={3} alignItems="center">
                <Text>{modalTitleIconUrl.enabled ? "Custom" : "Default"}</Text>
                <Switch
                  size="lg"
                  isChecked={modalTitleIconUrl.enabled}
                  onChange={() => {
                    if (!modalTitleIconUrl.enabled) {
                      trackCustomize("modal-title-icon-switch");
                    }

                    setModalTitleIconUrl({
                      ...modalTitleIconUrl,
                      enabled: !modalTitleIconUrl.enabled,
                    });
                  }}
                ></Switch>
              </Flex>
            }
          >
            {modalTitleIconUrl.enabled && (
              <Input
                placeholder="https://..."
                value={modalTitleIconUrl.url}
                onClick={() => {
                  trackCustomize("modal-title-icon-input");
                }}
                onChange={(e) => {
                  setModalTitleIconUrl({
                    ...modalTitleIconUrl,
                    url: e.target.value,
                  });
                }}
              />
            )}
          </FormItem>
        </Flex>

        <Box borderTop="1px solid" borderColor="borderColor" />

        {/* Welcome Screen */}
        {welcomeScreenContent}

        <Box borderTop="1px solid" borderColor="borderColor" />

        {/* Terms of Service */}
        <Box>
          <Flex justifyContent="space-between" alignItems="center">
            <FormLabel m={0}> Terms of Service </FormLabel>
            <Switch
              isChecked={tosUrl.enabled}
              size="lg"
              onChange={() => {
                if (!tosUrl.enabled) {
                  trackCustomize("terms-of-service-switch");
                }
                setTosUrl({
                  url: tosUrl.url,
                  enabled: !tosUrl.enabled,
                });
              }}
            />
          </Flex>

          {tosUrl.enabled && (
            <>
              <Spacer height={2} />
              <Input
                value={tosUrl.url}
                placeholder="https://.."
                onClick={() => {
                  trackCustomize("terms-of-service-input");
                }}
                onChange={(e) =>
                  setTosUrl({
                    url: e.target.value,
                    enabled: tosUrl.enabled,
                  })
                }
              />
            </>
          )}
        </Box>

        {/* Privacy Policy */}
        <Box>
          <Flex justifyContent="space-between" alignItems="center">
            <FormLabel m={0}> Privacy Policy </FormLabel>
            <Switch
              isChecked={privacyPolicyUrl.enabled}
              size="lg"
              onChange={() => {
                if (!privacyPolicyUrl.enabled) {
                  trackCustomize("privacy-policy-switch");
                }
                setPrivacyPolicyUrl({
                  url: privacyPolicyUrl.url,
                  enabled: !privacyPolicyUrl.enabled,
                });
              }}
            />
          </Flex>

          {privacyPolicyUrl.enabled && (
            <>
              <Spacer height={2} />
              <Input
                onClick={() => {
                  trackCustomize("privacy-policy");
                }}
                value={privacyPolicyUrl.url}
                placeholder="https://.."
                onChange={(e) =>
                  setPrivacyPolicyUrl({
                    url: e.target.value,
                    enabled: privacyPolicyUrl.enabled,
                  })
                }
              />
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );

  type ColorMeta = { key: keyof (typeof themeObj)["colors"]; name: string };

  const renderColorList = (sectionName: string, _colorList: ColorMeta[]) => (
    <Box>
      <Heading as="h3" fontSize={16} color="faded">
        {sectionName}
      </Heading>
      <Spacer height={5} />
      <Flex gap={6} flexDir="column">
        {_colorList.map((colorInfo) => {
          return (
            <ColorInput
              onClick={() => {
                trackCustomize("color", { colorKey: colorInfo.key });
              }}
              key={colorInfo.key}
              value={themeObj.colors[colorInfo.key]}
              name={colorInfo.name}
              onChange={(value) => {
                setColorOverrides((c) => ({ ...c, [colorInfo.key]: value }));
                // also change dropdownBg
                if (colorInfo.key === "modalBg") {
                  setColorOverrides((c) => ({ ...c, dropdownBg: value }));
                }

                if (colorInfo.key === "accentText") {
                  setColorOverrides((c) => ({ ...c, accentButtonBg: value }));
                }
              }}
            />
          );
        })}
      </Flex>
    </Box>
  );

  const tab3 = (
    <Box>
      <FormItem label="Theme">
        <Flex gap={2}>
          <ThemeButton
            trackingCategory={trackingCategory}
            theme="dark"
            isSelected={selectedTheme === "dark"}
            onClick={() => {
              if (selectedTheme !== "dark") {
                toggleColorMode();
              }
            }}
          />

          <ThemeButton
            trackingCategory={trackingCategory}
            theme="light"
            isSelected={selectedTheme === "light"}
            onClick={() => {
              if (selectedTheme !== "light") {
                toggleColorMode();
              }
            }}
          />
        </Flex>
      </FormItem>

      <Spacer height={10} />

      <Flex flexDir="column" gap={10}>
        {renderColorList("Basic", [
          {
            name: "Accent",
            key: "accentText",
          },
          {
            name: "Background",
            key: "modalBg",
          },
          {
            name: "Border Color",
            key: "borderColor",
          },
          {
            name: "Separator Line",
            key: "separatorLine",
          },
          {
            name: "Danger",
            key: "danger",
          },
          {
            name: "Success",
            key: "success",
          },
        ])}

        {renderColorList("Texts", [
          {
            name: "Primary Text",
            key: "primaryText",
          },
          {
            name: "Secondary Text",
            key: "secondaryText",
          },
        ])}

        {renderColorList("Buttons", [
          {
            name: "Accent Button Background",
            key: "accentButtonBg",
          },
          {
            name: "Accent Button Text",
            key: "accentButtonText",
          },
          {
            name: "Primary Button Background",
            key: "primaryButtonBg",
          },
          {
            name: "Primary Button Text",
            key: "primaryButtonText",
          },
          {
            name: "Secondary Button Background",
            key: "secondaryButtonBg",
          },
          {
            name: "Secondary Button Hover Background",
            key: "secondaryButtonHoverBg",
          },
          {
            name: "Secondary Button Text",
            key: "secondaryButtonText",
          },
          {
            name: "Connected Button Background",
            key: "connectedButtonBg",
          },
          {
            name: "Connected Button Hover Background",
            key: "connectedButtonBgHover",
          },
          {
            name: "Wallet Selector Button Hover Background",
            key: "walletSelectorButtonHoverBg",
          },
        ])}

        {renderColorList("Icons", [
          {
            name: "Secondary Icon Color",
            key: "secondaryIconColor",
          },
          {
            name: "Secondary Icon Hover Color",
            key: "secondaryIconHoverColor",
          },
          {
            name: "Secondary Icon Hover Background",
            key: "secondaryIconHoverBg",
          },
        ])}

        {renderColorList("Others", [
          {
            name: "Loading Skeleton Color",
            key: "skeletonBg",
          },
          {
            name: "User Selected Text Color",
            key: "selectedTextColor",
          },
          {
            name: "User Selected Text Background",
            key: "selectedTextBg",
          },
        ])}
      </Flex>
    </Box>
  );

  return (
    <Box>
      <Flex gap={2} alignItems="center">
        <Icon as={BsStars} width={6} height={6} color="faded" />
        <Heading fontSize={20}>Customize</Heading>
      </Flex>

      <Spacer height={6} />
      <Grid
        templateColumns={{
          md: "1fr 732px",
          sm: "1fr",
        }}
        gap={{
          base: 14,
          md: 8,
        }}
      >
        {/* left */}
        <GridItem>
          {/* Tabs */}
          <Flex gap={2}>
            <CustomTab
              label="General"
              isActive={tabToShow === 1}
              onClick={() => {
                trackCustomize("tab", { tabName: "general" });
                setTabToShow(1);
              }}
            />
            <CustomTab
              label="Appearance"
              isActive={tabToShow === 2}
              onClick={() => {
                trackCustomize("tab", { tabName: "appearance" });
                setTabToShow(2);
              }}
            />
            <CustomTab
              label="Theming"
              isActive={tabToShow === 3}
              onClick={() => {
                trackCustomize("tab", { tabName: "theming" });
                setTabToShow(3);
              }}
            />
          </Flex>

          <Spacer height={8} />

          {tabToShow === 1 && tab1}
          {tabToShow === 2 && tab2}
          {tabToShow === 3 && tab3}
        </GridItem>

        {/* right */}
        <GridItem>
          <Box position="sticky" top={3}>
            {previewSection}
            <Spacer height={8} />
            <Text color="faded"> Code </Text>
            <Spacer height={2} />
            <CodeBlock
              language="jsx"
              code={code}
              maxH="400px"
              overflowY="auto"
              onClick={() => {
                trackCustomize("code");
              }}
            />
            <Spacer height={2} />
            <Box
              as="article"
              bg="bgWhite"
              border="1px solid"
              borderColor="borderColor"
              borderRadius="lg"
              overflow="hidden"
              py="8"
              px="8"
            >
              <Heading fontSize={20}>Try it out on mobile</Heading>
              <Heading as="label" size="label.sm">
                (iOS demo app coming soon)
              </Heading>
              <Spacer height={2} />
              <ChakraNextLink
                href={
                  "https://play.google.com/store/search?q=thirdweb&c=apps&hl=en_US&gl=US"
                }
              >
                <ChakraNextImage
                  alt=""
                  src={require("public/assets/connect-wallet/google-play-button.svg")}
                />
              </ChakraNextLink>
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

function CustomTab(props: {
  label: string;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <Button
      fontWeight={600}
      fontSize={14}
      onClick={props.onClick}
      border="2px solid"
      borderRadius="lg"
      borderColor={props.isActive ? "blue.500" : "borderColor"}
      bg="none"
      color={props.isActive ? "heading" : "faded"}
      _hover={{
        bg: "inputBg",
        borderColor: "heading",
      }}
    >
      {props.label}
    </Button>
  );
}

function addOrRemoveFromList<T>(list: T[], item: T) {
  if (list.includes(item)) {
    return list.filter((x) => x !== item);
  }
  return [...list, item];
}
