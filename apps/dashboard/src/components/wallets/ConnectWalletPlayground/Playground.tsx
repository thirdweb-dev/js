import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Icon,
  Input,
  Select,
  Spacer,
  Switch,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { ConnectWallet } from "@thirdweb-dev/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { ChakraNextImage } from "components/Image";
import { useTrack } from "hooks/analytics/useTrack";
import { useTheme } from "next-themes";
import parserBabel from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";
import { format } from "prettier/standalone";
import { useEffect, useState } from "react";
import { AiOutlineStar, AiOutlineWarning } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import { FiChevronRight } from "react-icons/fi";
import {
  Button,
  CodeBlock,
  FormLabel,
  Heading,
  Text,
  TrackedLink,
} from "tw-components";
import { ColorInput } from "./ColorInput";
import {
  ConnectModalInlinePreview,
  type WelcomeScreen,
  useCanShowInlineModal,
} from "./ConnectModalInlinePreview";
import { FormItem } from "./FormItem";
import { ModalSizeButton } from "./ModalSizeButton";
import { PreviewThirdwebProvider } from "./PreviewThirdwebProvider";
import { SwitchFormItem } from "./SwitchFormItem";
import { ThemeButton } from "./ThemeButton";
import {
  RecommendedIconButton,
  SocialButton,
  WalletButton,
} from "./WalletButton";
import { getCode } from "./getCode";
import { usePlaygroundTheme } from "./usePlaygroundTheme";
import { usePlaygroundWallets } from "./usePlaygroundWallets";
import { type WalletId, walletInfoRecord } from "./walletInfoRecord";

type LocaleId = "en-US" | "ja-JP" | "es-ES";

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
  const [showThirdwebBranding, setShowThirdwebBranding] =
    useState<boolean>(true);

  const [welcomeScreen, setWelcomeScreen] = useState<WelcomeScreen | undefined>(
    undefined,
  );

  // FIXME: instead of states we should use a form and then that can handle this
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (welcomeScreen) {
      if (
        !welcomeScreen.img &&
        !welcomeScreen.title &&
        !welcomeScreen.subtitle
      ) {
        setWelcomeScreen(undefined);
      }
    }
  }, [welcomeScreen]);

  const { theme, setTheme } = useTheme();
  const selectedTheme = theme === "light" ? "light" : "dark";
  const [locale, setLocale] = useState<LocaleId>("en-US");

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
    "Email Wallet": true,
    Trust: false,
    Zerion: false,
    Rainbow: false,
    Phantom: false,
  });

  const codeQuery = useQuery({
    queryKey: [
      "playground-code",
      {
        btnTitle,
        enabledWallets,
        modalTitle,
        selectedTheme,
        modalSize,
        smartWalletOptions,
        modalTitleIconUrl,
        welcomeScreen: !!welcomeScreen,
        colorOverrides,
        tosUrl,
        privacyPolicyUrl,
        locale,
        socialOptions,
        showThirdwebBranding,
      },
    ],
    queryFn: async () => {
      const getSupportedWalletsCode = (
        walletIds: WalletId[],
      ): string | undefined => {
        if (!walletIds.length) {
          return undefined;
        }

        return `[${walletIds
          .map((walletId) => {
            let walletCode = walletInfoRecord[walletId].code;

            if (walletId === "Email Wallet") {
              if (!socialOptions.length) {
                walletCode = "inAppWallet()";
              } else {
                // biome-ignore lint/suspicious/noExplicitAny: FIXME
                const options: Record<string, any> = {};
                if (socialOptions.length) {
                  options.auth = {
                    options: socialOptions,
                  };
                }

                walletCode = `inAppWallet(${JSON.stringify(options, null, 2)})`;
              }
            }

            return walletCode;
          })
          .join(",")}]`;
      };

      const _code = getCode({
        baseTheme: selectedTheme,

        colorOverrides,
        imports: enabledWallets.map(
          (walletId) => walletInfoRecord[walletId].import,
        ),
        wallets: getSupportedWalletsCode(enabledWallets),
        smartWalletOptions: smartWalletOptions.enabled
          ? {
              gasless: smartWalletOptions.gasless,
            }
          : undefined,
        connectWallet: {
          locale: locale !== "en-US" ? `"${locale}"` : undefined,
          theme: `"${selectedTheme}"`,
          connectButton: btnTitle ? `{ label: "${btnTitle}" }` : undefined,
          connectModal: JSON.stringify({
            size: modalSize,
            title: modalTitle ? modalTitle : undefined,
            titleIcon: modalTitleIconUrl.enabled
              ? modalTitleIconUrl.url
              : undefined,
            welcomeScreen: welcomeScreen
              ? Object.keys(welcomeScreen).length > 0
                ? welcomeScreen
                : undefined
              : undefined,
            termsOfServiceUrl: tosUrl.enabled ? tosUrl.url : undefined,
            privacyPolicyUrl: privacyPolicyUrl.enabled
              ? privacyPolicyUrl.url
              : undefined,
            showThirdwebBranding:
              showThirdwebBranding === false ? false : undefined,
          }),
          chain: undefined,
        },
      });

      async function formatCodeAndSetState(
        unformattedCode: string,
      ): Promise<string> {
        try {
          const formattedCode = await format(unformattedCode, {
            parser: "babel",
            plugins: [parserBabel, estree],
            printWidth: 50,
          });

          return formattedCode;
        } catch (error) {
          throw new Error(`Error formatting the code: ${error}`);
        }
      }

      return formatCodeAndSetState(_code);
    },
    keepPreviousData: true,
  });

  const code = codeQuery.data || "";

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
          value={welcomeScreen?.title}
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
          value={welcomeScreen?.subtitle}
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
            <Text>{welcomeScreen?.img ? "Custom" : "Default"}</Text>
            <Switch
              size="lg"
              isChecked={!!welcomeScreen?.img}
              onChange={() => {
                trackCustomize("splash-image-switch");
                setWelcomeScreen({
                  ...welcomeScreen,
                  img: welcomeScreen?.img
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
        {welcomeScreen?.img && (
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
      name: "Sign in with phone number",
      key: "phone",
    },
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
                  walletName: "In-App Wallet",
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
              walletName: "In-App Wallet",
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
        isExternal
        href="https://portal.thirdweb.com/typescript/v5/supported-wallets"
        color="blue.500"
        category={trackingCategory}
        label="see-all-wallets"
        display="flex"
        alignItems="center"
        gap={1}
      >
        See all wallets
        <Icon as={FiChevronRight} w={4} h={4} color="blue.500" />
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
            authEnabled={false}
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
              switchToActiveChain={true}
              welcomeScreen={welcomeScreen}
              termsOfServiceUrl={tosUrl.enabled ? tosUrl.url : undefined}
              privacyPolicyUrl={
                privacyPolicyUrl.enabled ? privacyPolicyUrl.url : undefined
              }
              showThirdwebBranding={showThirdwebBranding}
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
          authEnabled={false}
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
                showThirdwebBranding={showThirdwebBranding}
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
              setLocale(e.target.value as LocaleId);
            }}
          >
            <option value="en-US">English </option>
            <option value="ja-JP">Japanese </option>
            <option value="es-ES">Spanish </option>
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

      {/* Account Abstraction */}
      <SwitchFormItem
        label="Sponsor gas fees with Account Abstraction"
        description="Abstract away gas fees for users of your app. Uses ERC-4337 (Account Abstraction) compatible smart accounts"
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
      {enabledWallets.length > 0 && smartWalletOptions.enabled && (
        <Alert
          status="info"
          borderRadius="lg"
          backgroundColor="backgroundCardHighlight"
          borderLeftColor="blue.500"
          borderLeftWidth={4}
          as={Flex}
          gap={1}
          mt={4}
        >
          <AlertIcon />
          <Flex flexDir="column">
            <AlertTitle>
              We highly recommend setting sponsorship rules to prevent abuse
            </AlertTitle>
            <AlertDescription as={Text}>
              You can set rules in the{" "}
              <TrackedLink
                href={"/dashboard/connect/account-abstraction?tab=1"}
                color="blue.500"
                category={trackingCategory}
                label="sponsorship-rules-config"
              >
                configuration page
              </TrackedLink>
              .
            </AlertDescription>
          </Flex>
        </Alert>
      )}

      {enabledWallets.length === 0 && (
        <>
          <Spacer h={3} fontWeight={500} />
          <Flex alignItems="center" gap={2}>
            <Icon as={AiOutlineWarning} color="orange.500" />
            <Text color="orange.500">
              Enable at least one wallet to use account abstraction
            </Text>
          </Flex>
        </>
      )}

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
                />
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

          {/* Show Thirdweb Branding */}
          <FormItem
            label="thirdweb Branding"
            description="Hide/Show 'Powered by thirdweb' branding at the bottom of the modal"
            addOn={
              <Switch
                size="lg"
                isChecked={showThirdwebBranding === true}
                onChange={() => {
                  if (showThirdwebBranding) {
                    trackCustomize("modal-tw-branding-switch");
                  }

                  setShowThirdwebBranding((c) => !c);
                }}
              />
            }
          >
            {null}
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
              setTheme("dark");
            }}
          />

          <ThemeButton
            trackingCategory={trackingCategory}
            theme="light"
            isSelected={selectedTheme === "light"}
            onClick={() => {
              setTheme("light");
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
              maxH="300px"
              overflowY="auto"
              onClick={() => {
                trackCustomize("code");
              }}
            />

            <Flex
              as="article"
              justifyContent="space-between"
              alignItems="center"
              flexDir={{ base: "column", md: "row" }}
              py="2"
              px="4"
            >
              <Heading size={"title.sm"}>Try it out on mobile</Heading>
              <TrackedLink
                isExternal
                noIcon
                href={
                  "https://play.google.com/store/search?q=thirdweb&c=apps&hl=en_US&gl=US"
                }
                bg="transparent"
                category={trackingCategory}
                label="google-play-button"
              >
                <ChakraNextImage
                  alt=""
                  src={require("../../../../public/assets/connect-wallet/google-play-button.svg")}
                />
              </TrackedLink>
              <TrackedLink
                isExternal
                noIcon
                href={
                  "https://apps.apple.com/us/app/thirdweb-connect/id6471451064"
                }
                bg="transparent"
                category={trackingCategory}
                label="apple-store-button"
              >
                <ChakraNextImage
                  alt=""
                  src={require("../../../../public/assets/connect-wallet/apple-store-button.svg")}
                />
              </TrackedLink>
            </Flex>
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
