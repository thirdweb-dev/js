import { Flex, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import { Button, Heading, TrackedLink, Text } from "tw-components";
import { AccountForm } from "components/settings/Account/AccountForm";
import {
  Account,
  AccountPlan,
  AccountStatus,
  useUpdateAccountPlan,
} from "@3rdweb-sdk/react/hooks/useApi";
import { ManageBillingButton } from "components/settings/Account/Billing/ManageButton";
import { StepsCard } from "components/dashboard/StepsCard";
import { useEffect, useMemo, useState } from "react";
import { PLANS } from "utils/pricing";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { BillingDowngradeDialog } from "./DowngradeDialog";
import { BillingHeader } from "./Header";
import { BillingPricing } from "./Pricing";
import { OnboardingBilling } from "components/onboarding/Billing";
import { OnboardingModal } from "components/onboarding/Modal";
import { FiExternalLink } from "react-icons/fi";
import { useLocalStorage } from "hooks/useLocalStorage";

interface BillingProps {
  account: Account;
}

export const Billing: React.FC<BillingProps> = ({ account }) => {
  const [claimedGrowth] = useLocalStorage("claim-growth-trial", false, true);
  const updatePlanMutation = useUpdateAccountPlan();
  const {
    isOpen: isPaymentMethodOpen,
    onOpen: onPaymentMethodOpen,
    onClose: onPaymentMethodClose,
  } = useDisclosure();
  const [paymentMethodSaving, setPaymentMethodSaving] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<AccountPlan | undefined>();
  const trackEvent = useTrack();

  const [stepsCompleted, setStepsCompleted] = useState<
    | undefined
    | {
        account: boolean;
        payment: boolean;
      }
  >();

  const [downgradePlan, setDowngradePlan] = useState<AccountPlan | undefined>();

  const { onSuccess, onError } = useTxNotifications(
    "Billing plan changed.",
    "Failed to change your billing plan.",
  );

  const validPayment = account.status === AccountStatus.ValidPayment;
  const paymentVerification =
    account.status === AccountStatus.PaymentVerification;
  const invalidPayment = account.status === AccountStatus.InvalidPayment;

  const handleUpdatePlan = (plan: AccountPlan, feedback?: string) => {
    const action = downgradePlan ? "downgradePlan" : "upgradePlan";
    setDowngradePlan(undefined);

    trackEvent({
      category: "account",
      action,
      label: "attempt",
    });

    updatePlanMutation.mutate(
      {
        plan,
        feedback,
        useTrial: !!claimedGrowth && validPayment,
      },
      {
        onSuccess: () => {
          onSuccess();

          trackEvent({
            category: "account",
            action,
            label: "success",
            data: {
              plan,
              feedback,
            },
          });
        },
        onError: (error) => {
          onError(error);

          trackEvent({
            category: "account",
            action,
            label: "error",
            error,
          });
        },
      },
    );
  };

  const handlePlanSelect = (plan: AccountPlan) => {
    if (invalidPayment || paymentVerification) {
      return;
    }

    if (!validPayment) {
      setSelectedPlan(plan);
      onPaymentMethodOpen();
      return;
    }
    // downgrade from Growth to Free
    if (plan === AccountPlan.Free || account.plan === AccountPlan.Growth) {
      setDowngradePlan(plan);
    } else {
      handleUpdatePlan(plan);
    }
  };

  const handlePaymentAdded = () => {
    setPaymentMethodSaving(true);
    onPaymentMethodClose();
  };

  const handleDowngradeAlertClose = () => {
    setDowngradePlan(undefined);
  };

  const steps = useMemo(() => {
    if (!stepsCompleted) {
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
        description: "Click the link below to your payment method.",
        completed: stepsCompleted.payment,
        children: (
          <ManageBillingButton
            account={account}
            loading={paymentMethodSaving}
            loadingText="Verifying payment method"
            onClick={onPaymentMethodOpen}
          />
        ),
      },
    ];
  }, [account, onPaymentMethodOpen, paymentMethodSaving, stepsCompleted]);

  useEffect(() => {
    if (account) {
      const paymentCompleted = validPayment;

      setStepsCompleted({
        account: !!account.email,
        payment: paymentCompleted,
      });

      if (paymentCompleted && paymentMethodSaving) {
        // user chose a growth plan before adding a payment method,
        // and didn't have it already set, so update it here when payment
        // method is available.
        if (
          account.plan !== AccountPlan.Growth &&
          selectedPlan === AccountPlan.Growth
        ) {
          handleUpdatePlan(selectedPlan);
          setSelectedPlan(undefined);
        }
      }

      if (paymentCompleted || paymentVerification) {
        setPaymentMethodSaving(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, validPayment, paymentVerification, invalidPayment]);

  const showSteps = [
    AccountStatus.NoCustomer,
    AccountStatus.NoPayment,
    AccountStatus.InvalidPayment,
  ].includes(account.status);

  return (
    <Flex flexDir="column" gap={8}>
      {showSteps ? (
        <>
          <StepsCard title="Get started with billing" steps={steps} />

          <OnboardingModal
            isOpen={isPaymentMethodOpen}
            onClose={onPaymentMethodClose}
          >
            <OnboardingBilling
              onSave={handlePaymentAdded}
              onCancel={onPaymentMethodClose}
            />
          </OnboardingModal>
        </>
      ) : (
        <>
          <BillingHeader
            validPayment={validPayment}
            paymentVerification={paymentVerification}
          />
          <AccountForm account={account} disableUnchanged showBillingButton />
        </>
      )}

      <BillingPricing
        plan={account.plan}
        validPayment={validPayment}
        paymentVerification={paymentVerification}
        invalidPayment={invalidPayment}
        loading={paymentMethodSaving || updatePlanMutation.isLoading}
        canTrialGrowth={!!claimedGrowth && !account.trialPeriodEndedAt}
        trialPeriodEndedAt={account.trialPeriodEndedAt}
        onSelect={handlePlanSelect}
      />

      <TrackedLink
        textAlign="center"
        category="account"
        href="/pricing"
        label="pricing-plans"
        color="blue.500"
        isExternal
      >
        <HStack alignItems="center" gap={2}>
          <Text color="blue.500">Learn more about thirdweb&apos;s pricing</Text>
          <Icon as={FiExternalLink} />
        </HStack>
      </TrackedLink>

      {downgradePlan && (
        <BillingDowngradeDialog
          oldPlan={PLANS[account.plan].title}
          newPlan={PLANS[downgradePlan].title}
          oldPlanFeatures={PLANS[account.plan].features}
          onClose={handleDowngradeAlertClose}
          onConfirm={(feedback) => handleUpdatePlan(downgradePlan, feedback)}
          loading={updatePlanMutation.isLoading}
        />
      )}
    </Flex>
  );
};
