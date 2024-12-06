import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { Flex, FormControl, Input, Textarea } from "@chakra-ui/react";
import { Select as ChakraSelect } from "chakra-react-select";
import { ChakraNextImage } from "components/Image";
import { useTrack } from "hooks/analytics/useTrack";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button, FormHelperText, FormLabel } from "tw-components";
import type { Team } from "../../@/api/team";
import { PlanToCreditsRecord } from "./ApplyForOpCreditsModal";

interface FormSchema {
  firstname: string;
  lastname: string;
  thirdweb_account_id: string;
  plan_type: string;
  email: string;
  company: string;
  website: string;
  twitterhandle: string;
  superchain_verticals: string;
  superchain_chain: string;
  what_would_you_like_to_meet_about_: string;
}

interface ApplyForOpCreditsFormProps {
  onClose: () => void;
  plan: Team["billingPlan"];
  account: Account;
}

export const ApplyForOpCreditsForm: React.FC<ApplyForOpCreditsFormProps> = ({
  onClose,
  account,
  plan,
}) => {
  const [, setHasAppliedForOpGrant] = useLocalStorage(
    `appliedForOpGrant-${account?.id}`,
    false,
  );
  const transformedQueryData = useMemo(
    () => ({
      firstname: "",
      lastname: "",
      thirdweb_account_id: account?.id || "",
      plan_type: PlanToCreditsRecord[plan].title,
      email: account?.email || "",
      company: "",
      website: "",
      twitterhandle: "",
      superchain_verticals: "",
      superchain_chain: "",
      what_would_you_like_to_meet_about_: "",
    }),
    [account, plan],
  );

  const form = useForm<FormSchema>({
    defaultValues: transformedQueryData,
    values: transformedQueryData,
  });

  const trackEvent = useTrack();

  const { onSuccess, onError } = useTxNotifications(
    "We have received your application and will notify you if you are selected.",
    "Something went wrong, please try again.",
  );

  // TODO: find better way to track impressions
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    trackEvent({
      category: "op-sponsorship",
      action: "modal",
      label: "view-form",
    });
  }, [trackEvent]);

  return (
    <Flex
      direction="column"
      gap={4}
      as="form"
      onSubmit={form.handleSubmit(async (data) => {
        const fields = Object.keys(data).map((key) => ({
          name: key,
          // biome-ignore lint/suspicious/noExplicitAny: FIXME
          value: (data as any)[key],
        }));

        trackEvent({
          category: "op-sponsorship",
          action: "apply",
          label: "attempt",
        });

        try {
          const response = await fetch("/api/apply-op-sponsorship", {
            method: "POST",
            body: JSON.stringify({ fields }),
          });

          if (!response.ok) {
            trackEvent({
              category: "op-sponsorship",
              action: "apply",
              label: "error",
              error: "form-submission-failed",
            });
            throw new Error("Form submission failed");
          }

          await response.json();

          trackEvent({
            category: "op-sponsorship",
            action: "apply",
            label: "success",
          });

          onSuccess();
          onClose();
          setHasAppliedForOpGrant(true);

          form.reset();
        } catch (error) {
          trackEvent({
            category: "op-sponsorship",
            action: "apply",
            label: "error",
            error: (error as Error).message,
          });
          onError(error);
        }
      })}
    >
      <Flex flexDir="column" gap={4}>
        <ChakraNextImage
          src={require("../../../public/assets/dashboard/op-sponsorship-form.png")}
          alt=""
          w="full"
        />
        <Flex gap={4}>
          <FormControl gap={6} isRequired>
            <FormLabel>First Name</FormLabel>
            <Input {...form.register("firstname", { required: true })} />
          </FormControl>
          <FormControl gap={6} isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input {...form.register("lastname", { required: true })} />
          </FormControl>
        </Flex>
        <FormControl gap={6} isRequired>
          <FormLabel>Company Name</FormLabel>
          <Input {...form.register("company", { required: true })} />
        </FormControl>
        <FormControl gap={6} isRequired>
          <FormLabel>Company Website</FormLabel>
          <Input type="url" {...form.register("website", { required: true })} />
          <FormHelperText>URL should start with https://</FormHelperText>
        </FormControl>
        <FormControl gap={6} isRequired>
          <FormLabel>Company Social Account</FormLabel>
          <Input
            type="url"
            {...form.register("twitterhandle", { required: true })}
          />
          <FormHelperText>URL should start with https://</FormHelperText>
        </FormControl>
        <FormControl gap={6} isRequired>
          <FormLabel>Industry</FormLabel>
          <ChakraSelect
            options={[
              "DAOs",
              "Education & Community",
              "Fandom & Rewards",
              "Gaming & Metaverse",
              "Infra & Dev Tools",
              "NFTs",
              "Payments & Finance (DeFi)",
              "Security & Identity",
              "Social",
              "Other",
            ].map((vertical) => ({
              label: vertical,
              value:
                vertical === "Payments & Finance (DeFi)" ? "DeFi" : vertical,
            }))}
            placeholder="Select industry"
            isRequired
            // @ts-expect-error - this works fine
            onChange={(value) => {
              if (value?.value) {
                form.setValue("superchain_verticals", value.value);
              }
            }}
          />
        </FormControl>
        <FormControl gap={6} isRequired>
          <FormLabel>Chain</FormLabel>
          <ChakraSelect
            options={[
              "Optimism",
              "Base",
              "Zora",
              "Mode",
              "Frax",
              "Cyber",
              "Redstone",
              "Ancient8",
              "Donatuz",
              "Mantle",
              "Soneium",
              "Lisk",
              "Arena-Z",
            ].map((chain) => ({
              label: chain === "Optimism" ? "OP Mainnet" : chain,
              value: chain,
            }))}
            // @ts-expect-error - this works fine
            onChange={(values) => {
              form.setValue(
                "superchain_chain",
                values
                  // @ts-expect-error - this works fine
                  .map(({ value }) => value)
                  .join(";"),
              );
            }}
            isMulti
            selectedOptionStyle="check"
            placeholder="Select chains"
            isRequired
          />
        </FormControl>
        <FormControl gap={6}>
          <FormLabel>Tell us more about your project</FormLabel>
          <Textarea
            {...form.register("what_would_you_like_to_meet_about_")}
            placeholder="Tell us more about your project -- the more you share, the easier you make the approval process."
          />
          <FormHelperText>Minimum 150 characters recommended.</FormHelperText>
        </FormControl>
      </Flex>
      <div className="flex flex-row">
        <Button
          w="full"
          type="submit"
          colorScheme="primary"
          isDisabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Applying..." : "Apply now"}
        </Button>
      </div>
    </Flex>
  );
};
