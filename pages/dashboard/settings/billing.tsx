import { AppLayout } from "components/app-layouts/app";
import { Flex, HStack, Icon } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import { ConnectWalletPrompt } from "components/settings/ConnectWalletPrompt";
import { Button, Heading, Text, Badge, Card } from "tw-components";
import { AccountForm } from "components/settings/Account/AccountForm";
import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { ManageBillingButton } from "components/settings/Account/ManageBillingButton";
import { StepsCard } from "components/dashboard/StepsCard";
import { useEffect, useMemo, useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";
import { BillingPlan } from "components/settings/Account/BillingPlan";
import { useRouter } from "next/router";

const SettingsBillingPage: ThirdwebNextPage = () => {
  const address = useAddress();
  const meQuery = useAccount();
  const router = useRouter();
  const { data: account } = meQuery;
  const validPayment = account?.status === "validPayment";
  const paymentVerification = account?.status === "paymentVerification";

  const [stepsCompleted, setStepsCompleted] = useState<
    | undefined
    | {
        account: boolean;
        payment: boolean;
      }
  >();

  const steps = useMemo(() => {
    if (!stepsCompleted || !account) {
      return [];
    }

    return [
      {
        title: (
          <HStack justifyContent="space-between">
            <Heading
              size="label.md"
              opacity={!stepsCompleted.account ? 1 : 0.6}
            >
              Enter billing account info
            </Heading>
            {stepsCompleted.account && (
              <Button
                size="sm"
                variant="link"
                colorScheme="blue"
                fontWeight="normal"
                onClick={() =>
                  setStepsCompleted({ account: false, payment: false })
                }
              >
                Edit
              </Button>
            )}
          </HStack>
        ),
        description:
          "This information will be used for billing notifications and invoices.",
        completed: stepsCompleted.account,
        children: (
          <AccountForm
            account={account}
            previewEnabled={stepsCompleted.account}
            horizontal
            onSave={() => setStepsCompleted({ account: true, payment: false })}
          />
        ),
        showCompletedChildren: true,
      },
      {
        title: "Add a payment method",
        description:
          "Visit the customer portal, verify your email, and add a payment method.",
        completed: stepsCompleted.payment,
        children: <ManageBillingButton account={account} />,
      },
    ];
  }, [account, stepsCompleted]);

  useEffect(() => {
    let refetchInterval: ReturnType<typeof setInterval> | undefined;

    if (
      ["noPayment", "paymentVerification"].includes(account?.status as string)
    ) {
      refetchInterval = setInterval(() => {
        meQuery.refetch();
      }, 3000);
    } else if (refetchInterval) {
      clearTimeout(refetchInterval);
    }

    return () => {
      if (refetchInterval) {
        clearTimeout(refetchInterval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    if (!stepsCompleted && account) {
      setStepsCompleted({
        account: !!account.email,
        payment: validPayment || paymentVerification,
      });
    }
  }, [account, stepsCompleted, validPayment, paymentVerification]);

  useEffect(() => {
    const { payment_intent, source_redirect_slug } = router.query;
    if (payment_intent || source_redirect_slug) {
      router.replace("/dashboard/settings/billing");
    }
  }, [router]);

  if (!address) {
    return <ConnectWalletPrompt />;
  }

  if (!account) {
    return null;
  }

  const showSteps = ["noCustomer", "noPayment"].includes(account.status);

  return (
    <Flex flexDir="column" gap={8} mt={{ base: 2, md: 6 }} maxW="3xl">
      <Card>
        <BillingPlan
          account={account}
          direction="column"
          description="Free of charge with pay as you-go pricing"
          titleSize="label.lg"
          titleColor="bgBlack"
        />
      </Card>

      {showSteps ? (
        <StepsCard title="Get started with billing" steps={steps} />
      ) : (
        <>
          <Flex direction="column" gap={2}>
            <Heading size="title.lg" as="h1">
              Account & Billing
            </Heading>

            <HStack>
              <Text size="body.md">
                Your billing information and preferences.
              </Text>

              <Badge
                borderRadius="full"
                size="label.sm"
                variant="subtle"
                px={3}
                py={1.5}
              >
                <HStack>
                  <Icon
                    as={
                      validPayment
                        ? FiCheckCircle
                        : paymentVerification
                        ? FiInfo
                        : FiAlertCircle
                    }
                    color={
                      validPayment
                        ? "green.500"
                        : paymentVerification
                        ? "orange.500"
                        : "red.500"
                    }
                  />
                  <Text size="label.sm">
                    {validPayment
                      ? "Valid payment"
                      : paymentVerification
                      ? "Needs verification"
                      : "Invalid payment"}
                  </Text>
                </HStack>
              </Badge>
            </HStack>
          </Flex>

          {meQuery.data && (
            <AccountForm
              account={meQuery.data}
              disableUnchanged
              showBillingButton
            />
          )}
        </>
      )}
    </Flex>
  );
};

SettingsBillingPage.pageId = PageId.SettingsUsage;

SettingsBillingPage.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <SettingsSidebar activePage="billing" />

    {page}
  </AppLayout>
);

export default SettingsBillingPage;
