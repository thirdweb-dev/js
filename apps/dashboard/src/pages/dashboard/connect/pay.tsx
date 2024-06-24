import { apiKeys } from "@3rdweb-sdk/react";
import { type ApiKey, useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { usePaymentsEnabledContracts } from "@3rdweb-sdk/react/hooks/usePayments";
import {
  Box,
  type BoxProps,
  Flex,
  FormControl,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  type UseRadioProps,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "components/app-layouts/app";
import { OldPaySetting } from "components/pay/OldPaySetting";
import { PayConfig } from "components/pay/PayConfig";
import { EnabledContracts } from "components/payments/contracts/enabled-contracts";
import { PaymentContracts } from "components/payments/contracts/payment-contracts";
import { ApiKeysMenu } from "components/settings/ApiKeys/Menu";
import { NoApiKeys } from "components/settings/ApiKeys/NoApiKeys";
import { ConnectWalletPrompt } from "components/settings/ConnectWalletPrompt";
import { ConnectSidebar } from "core-ui/sidebar/connect";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Spinner } from "../../../@/components/ui/Spinner/Spinner";
import { TabButtons } from "../../../@/components/ui/tabs";
import { PayAnalytics } from "../../../components/pay/PayAnalytics/PayAnalytics";
import { PageId } from "../../../page-id";
import { TrackedLink } from "../../../tw-components";
import type { ThirdwebNextPage } from "../../../utils/types";

const TRACKING_CATEGORY = "pay";

function RadioCard(props: UseRadioProps & BoxProps) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        display={"flex"}
        alignItems={"center"}
        gap={2}
        cursor="pointer"
        borderWidth="2px"
        borderRadius="lg"
        _focus={{
          boxShadow: "outline",
        }}
        _checked={{
          borderColor: "blue.500",
        }}
        fontWeight={"semibold"}
        w={40}
        px={5}
        py={3}
      >
        <Box
          {...checkbox}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          rounded="full"
          w={5}
          h={5}
          borderWidth="3px"
          _checked={{
            borderColor: "blue.500",
          }}
        >
          <Box
            {...checkbox}
            w={2.5}
            h={2.5}
            bg="transparent"
            _checked={{
              bg: "blue.500",
            }}
            rounded="full"
          />
        </Box>

        {props.children}
      </Box>
    </Box>
  );
}

function usePayConfig() {
  const router = useRouter();
  const defaultClientId = router.query.clientId?.toString();
  const { user } = useLoggedInUser();
  const queryClient = useQueryClient();

  const [selectedKey_, setSelectedKey] = useState<undefined | ApiKey>();

  const keysQuery = useApiKeys();
  const apiKeysData = useMemo(
    () =>
      (keysQuery?.data ?? []).filter((key) => {
        return !!(key.services ?? []).find((srv) => srv.name === "pay");
      }),
    [keysQuery?.data],
  );
  const hasPayApiKeys = apiKeysData.length > 0;

  // FIXME: this seems like a deeper problem, solve later
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // query rehydrates from cache leading to stale results if user refreshes shortly after updating their dashboard.
    // Invalidate the query to force a refetch
    if (user?.address) {
      queryClient.invalidateQueries(apiKeys.keys(user?.address));
    }
  }, [queryClient, user?.address]);

  //  compute the actual selected key based on if there is a state, if there is a query param, or otherwise the first one
  const selectedKey = useMemo(() => {
    if (selectedKey_) {
      return selectedKey_;
    }
    if (apiKeysData.length) {
      if (defaultClientId) {
        return apiKeysData.find((k) => k.key === defaultClientId);
      }
      return apiKeysData[0];
    }
    return undefined;
  }, [apiKeysData, defaultClientId, selectedKey_]);

  return {
    hasPayApiKeys,
    selectedKey,
    setSelectedKey,
    apiKeysData,
    hasApiKeys: !!keysQuery.data?.length,
    isFetchingKeys: keysQuery.isFetching && !keysQuery.isRefetching,
  };
}

function useTabConfig() {
  const router = useRouter();
  const [tabOption, setTabOption] = useState<"pay" | "checkouts">(
    router.query.tab === "checkouts" ? "checkouts" : "pay",
  );

  const { data: paymentEnabledContracts } = usePaymentsEnabledContracts();
  const radioOptions = ["pay", "checkouts"].filter((option) => {
    return (
      option === "pay" ||
      (option === "checkouts" && (paymentEnabledContracts || [])?.length > 0)
    );
  });
  return { tabOption, setTabOption, radioOptions };
}

const DashboardConnectPay: ThirdwebNextPage = () => {
  const { tabOption, setTabOption, radioOptions } = useTabConfig();
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "config",
    defaultValue: "pay",
    onChange: (value: "pay" | "checkouts") => setTabOption(value),
  });

  const { isLoggedIn, isLoading } = useLoggedInUser();
  const {
    hasApiKeys,
    hasPayApiKeys,
    selectedKey,
    setSelectedKey,
    apiKeysData,
    isFetchingKeys,
  } = usePayConfig();
  // Pay setting api key configuration

  if (isLoading || isFetchingKeys) {
    return (
      <div className="min-h-[calc(100vh-300px)] lg:min-h-[calc(100vh-250px)] flex items-center justify-center">
        <Spinner className="size-14" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <ConnectWalletPrompt description="manage your Pay configuration" />;
  }

  return (
    <Flex flexDir="column" gap={8}>
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
        <div className="max-w-[800px]">
          <h1 className="text-5xl tracking-tight font-bold mb-5">Pay</h1>
          <p className="text-secondary-foreground leading-7">
            Pay allows your users to purchase cryptocurrencies and execute
            transactions with their credit card or debit card, or with any token
            via cross-chain routing.{" "}
            <TrackedLink
              isExternal
              category={TRACKING_CATEGORY}
              href="https://portal.thirdweb.com/connect/pay/overview"
              label="pay-docs"
              className="!text-link-foreground"
            >
              Learn more
            </TrackedLink>
          </p>
        </div>

        <div className="w-full lg:max-w-[300px]">
          {hasPayApiKeys && tabOption === "pay" && selectedKey && (
            <ApiKeysMenu
              apiKeys={apiKeysData}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
            />
          )}
        </div>
      </div>

      {radioOptions.length > 1 && (
        <FormControl>
          <Flex {...getRootProps()} gap={5}>
            {radioOptions.map((value) => {
              const radio = getRadioProps({ value });
              return (
                <RadioCard
                  key={value}
                  {...radio}
                  isChecked={value === tabOption}
                >
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </RadioCard>
              );
            })}
          </Flex>
        </FormControl>
      )}

      {tabOption === "checkouts" ? (
        <Tabs>
          <TabList>
            <Tab>Payments Enabled</Tab>
            <Tab>All Contracts</Tab>
            <Tab>Settings</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <EnabledContracts />
            </TabPanel>
            <TabPanel>
              <PaymentContracts />
            </TabPanel>
            <TabPanel>
              <OldPaySetting />
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <PayUI
          hasPayApiKeys={hasPayApiKeys}
          hasApiKeys={hasApiKeys}
          selectedKey={selectedKey}
        />
      )}
    </Flex>
  );
};

function PayUI(props: {
  hasPayApiKeys: boolean;
  hasApiKeys: boolean;
  selectedKey: ApiKey | undefined;
}) {
  const { hasPayApiKeys, hasApiKeys, selectedKey } = props;
  const [activeTab, setActiveTab] = useState<"settings" | "analytics">(
    "analytics",
  );

  return (
    <div>
      {!hasPayApiKeys && (
        <NoApiKeys
          service="Pay in Connect"
          buttonTextOverride={hasApiKeys ? "Enable Pay" : undefined}
          copyOverride={
            hasApiKeys
              ? "You'll need to enable pay as a service in an API Key to use Pay."
              : undefined
          }
        />
      )}

      {hasPayApiKeys && selectedKey && (
        <>
          <TabButtons
            tabs={[
              {
                name: "Analytics",
                isActive: activeTab === "analytics",
                onClick: () => setActiveTab("analytics"),
                isEnabled: true,
              },
              {
                name: "Settings",
                isActive: activeTab === "settings",
                onClick: () => setActiveTab("settings"),
                isEnabled: true,
              },
            ]}
          />

          <div className="h-5" />
          {activeTab === "settings" && <PayConfig apiKey={selectedKey} />}
          {activeTab === "analytics" && <PayAnalytics apiKey={selectedKey} />}
        </>
      )}
    </div>
  );
}

DashboardConnectPay.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <ConnectSidebar activePage="pay-settings" />
    {page}
  </AppLayout>
);

DashboardConnectPay.pageId = PageId.DashboardConnectPay;

export default DashboardConnectPay;
