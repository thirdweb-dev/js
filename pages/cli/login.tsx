import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { useAuthorizeWalletWithAccount } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Alert,
  AlertIcon,
  Container,
  Divider,
  Flex,
  FormControl,
  HStack,
  Icon,
  Input,
  ListItem,
  OrderedList,
  Switch,
  VStack,
} from "@chakra-ui/react";
import { useAddress, useAuth } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { useTrack } from "hooks/analytics/useTrack";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { ReactNode, useEffect, useState } from "react";
import { PiWarningFill } from "react-icons/pi";
import { Button, Card, FormLabel, Heading, Link, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const CLI_LOGIN_TOKEN_DURATION_IN_SECONDS = 60 * 60 * 24 * 365;

const LoginPage: ThirdwebNextPage = () => {
  const { payload } = useRouter().query;
  const { mutateAsync: authorizeWallet } = useAuthorizeWalletWithAccount();
  const [deviceName, setDeviceName] = useState<string>("");
  const [rejected, setRejected] = useState<boolean>(false);
  const trackEvent = useTrack();
  const [isBrave, setIsBrave] = useState<boolean>(false);
  const [hasRemovedShield, setHasRemovedShield] = useState<boolean>(false);

  const detectBrave = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - brave is not in the types
    return (navigator?.brave && (await navigator?.brave.isBrave())) || false;
  };

  const address = useAddress();
  const auth = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | ReactNode | undefined>(
    undefined,
  );
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    detectBrave().then((res) => {
      setIsBrave(res);
    });
  }, []);

  const generateToken = async () => {
    if (!payload) {
      trackEvent({
        category: "cli-login",
        action: "generate-token",
        label: "error",
        error: "payload not detected",
      });
      console.error("**** Payload not detected from the url! ****");
      return null;
    }
    const decodedPayload = decodeURIComponent(payload as string);
    const parsedPayload = JSON.parse(decodedPayload);
    let token;
    try {
      token = await auth?.generate(parsedPayload, {
        expirationTime: new Date(
          Date.now() + 1000 * CLI_LOGIN_TOKEN_DURATION_IN_SECONDS,
        ),
      });
    } catch (e) {
      setLoading(false);
      setRejected(true);
      trackEvent({
        category: "cli-login",
        action: "generate-token",
        label: "error",
        reason: "failed to generate token",
        error: e,
      });
      console.error("**** Failed to generate the token! ****\n", e);
    }
    if (!token) {
      return null;
    }
    try {
      const decodedToken = auth?.parseToken(token);
      await authorizeWallet({
        token,
        deviceName: deviceName || decodedToken?.payload.sub,
      });
      trackEvent({
        category: "cli-login",
        action: "authorize-device",
        label: "success",
        deviceName,
      });
      return token;
    } catch (e) {
      setLoading(false);
      trackEvent({
        category: "cli-login",
        action: "authorize-device",
        label: "error",
        reason: "failed to authorize device",
        error: e,
      });
      console.error("**** Failed to authorize! ****\n", e);
      return null;
    }
  };

  const authorizeDevice = async () => {
    const state = window.location.hash.replace("#", "");
    setLoading(true);

    try {
      const token = await generateToken();
      if (!token) {
        setErrorText(
          <Text color="red" fontSize="lg">
            Something went wrong, please reach out to us on Discord:{" "}
            <Link color="blue.200" href="https://discord.gg/thirdweb">
              https://discord.gg/thirdweb
            </Link>
          </Text>,
        );
        setLoading(false);
        console.error(
          `Something went wrong, please reach out to us on Discord: discord.gg/thirdweb.`,
        );
        // Tell the CLI that something went wrong.
        try {
          await fetch(`http://localhost:8976/auth/callback?failed=true`, {
            method: "POST",
          });
        } catch (err) {
          console.error(err);
        }
        return null;
      }
      const response = await fetch(
        `http://localhost:8976/auth/callback?token=${token}&state=${state}`,
        {
          method: "POST",
        },
      );
      if (response.ok) {
        trackEvent({
          category: "cli-login",
          action: "return-token-to-CLI",
          label: "success",
        });
        setSuccess(true);
        setErrorText(undefined);
        setLoading(false);
      } else {
        // This should never happen, but just in case
        setErrorText(
          <Text color="red" fontSize="lg">
            Something went wrong, please reach out to us on Discord:{" "}
            <Link color="blue.200" href="https://discord.gg/thirdweb">
              https://discord.gg/thirdweb
            </Link>
          </Text>,
        );
        setLoading(false);
        console.error(
          `Something went wrong: ${response.statusText}, please reach out to us on Discord: discord.gg/thirdweb.`,
        );
        trackEvent({
          category: "cli-login",
          action: "generate-token",
          label: "error",
          reason: "Error talking to CLI server",
        });
        // Tell the CLI that something went wrong.
        try {
          await fetch(`http://localhost:8976/auth/callback?failed=true`, {
            method: "POST",
          });
        } catch (err) {
          console.error(err);
        }
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      setErrorText(
        <Text color="red" fontSize="lg">
          Something went wrong, please reach out to us on Discord:{" "}
          <Link color="blue.200" href="https://discord.gg/thirdweb">
            https://discord.gg/thirdweb
          </Link>
        </Text>,
      );
      // Tell the CLI that something went wrong.
      try {
        await fetch(`http://localhost:8976/auth/callback?failed=true`, {
          method: "POST",
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!address) {
    return (
      <Container maxW="lg">
        <Card p={6} as={Flex} flexDir="column" gap={2}>
          <Heading as="h2" size="title.sm">
            Connect your wallet to get started
          </Heading>
          <Text>In order to continue, you need to sign-in with a wallet.</Text>
          <Divider my={4} />
          <CustomConnectWallet />
        </Card>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxW="container.lg" overflow="hidden" h="full">
        <Flex
          justify="center"
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          h="full"
          gap={8}
        >
          <VStack>
            <Heading>Your device is now linked to your account.</Heading>
            <Text fontSize="3xl">You may close this tab now.</Text>
          </VStack>
        </Flex>
      </Container>
    );
  }

  if (rejected) {
    return (
      <Container maxW="container.lg" overflow="hidden" h="full">
        <Flex
          justify="center"
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          h="full"
          gap={8}
        >
          <VStack>
            <Heading>
              You rejected the signature, your device was not linked.
            </Heading>
            <Text fontSize="3xl">You may close this tab now.</Text>
          </VStack>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" overflow="hidden" h="full">
      <Flex
        justify="center"
        flexDir="column"
        h="full"
        alignItems="start"
        textAlign="start"
      >
        {isBrave && (
          <Alert status="error" mb={4} rounded="lg" fontWeight="bold">
            <AlertIcon alignSelf="start" />
            <Flex
              direction="column"
              alignContent="start"
              textAlign="start"
              alignItems="start"
              ml={4}
            >
              <Text fontSize="2xs" fontWeight="bold" color="-moz-initial">
                We detected you&apos;re on Brave. Please make sure to turn off
                the Brave shields otherwise the authorization will fail.
              </Text>
              <OrderedList ml={4} my={2} fontWeight="bold">
                <ListItem>
                  Click on the Brave icon in the top address bar.
                </ListItem>
                <ListItem>Click on the toggle to disable the shields.</ListItem>
              </OrderedList>
              <HStack>
                <Text fontWeight="bold" color="-moz-initial">
                  I have disabled the Brave shields:
                </Text>
                <Switch
                  id="email-alerts"
                  isChecked={hasRemovedShield}
                  onChange={() => {
                    setHasRemovedShield(!hasRemovedShield);
                  }}
                />
              </HStack>
            </Flex>
          </Alert>
        )}
        <Heading mb={4}>Link this device to your thirdweb account</Heading>
        <Text mb={8}>
          By clicking the button below, you are authorizing this device to
          access your thirdweb account. You will be required to sign a
          transaction using the wallet associated with thirdweb. This needs to
          be done only once per device.
        </Text>
        <FormControl mb={8}>
          <FormLabel>
            Device name{" "}
            <Text fontWeight="thin" as="i">
              (optional)
            </Text>
          </FormLabel>
          <Text mb={2}>
            This is useful to identify which devices have access to your
            account, you can revoke device access through the settings page.
          </Text>
          <Input
            placeholder="Eg. work laptop"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            isDisabled={loading}
            maxWidth={600}
          />
        </FormControl>
        <Button
          variant="inverted"
          isDisabled={!address || (isBrave && !hasRemovedShield)}
          isLoading={loading}
          onClick={authorizeDevice}
        >
          Authorize device
        </Button>
        {isBrave && !hasRemovedShield && (
          <Text color="red" size="label.md" mt={4}>
            Please acknowledge that you have disabled the Brave shields above.
          </Text>
        )}
        <Text as="i" my={2} mb={8} size="label.sm" fontWeight="thin">
          Signing the transaction is gasless
        </Text>
        {errorText}
        <Card>
          <HStack>
            <Icon as={PiWarningFill} mr={2} fontSize={24} />
            <Text fontSize="md" fontWeight="medium">
              Do not authorize access if this link was sent to you, it could be
              used to perform actions on your account without your knowledge.
            </Text>
          </HStack>
        </Card>
      </Flex>
    </Container>
  );
};

LoginPage.getLayout = (page, props) => (
  <AppLayout layout="custom-contract" {...props}>
    {page}
  </AppLayout>
);
LoginPage.pageId = PageId.CliLoginPage;

export default LoginPage;
