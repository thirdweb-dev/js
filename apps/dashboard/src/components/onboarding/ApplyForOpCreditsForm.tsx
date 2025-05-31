import type { Team } from "@/api/team";
import { MultiSelect } from "@/components/blocks/multi-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { useTrack } from "hooks/analytics/useTrack";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { PlanToCreditsRecord } from "./ApplyForOpCreditsModal";
import { applyOpSponsorship } from "./applyOpSponsorship";

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
      plan_type: PlanToCreditsRecord[plan].plan,
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

  return (
    <form
      className="flex flex-col gap-4"
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
          const response = await applyOpSponsorship({
            fields,
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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <Label>First Name</Label>
            <Input {...form.register("firstname", { required: true })} />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <Label>Last Name</Label>
            <Input {...form.register("lastname", { required: true })} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Company Name</Label>
          <Input {...form.register("company", { required: true })} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Company Website</Label>
          <Input type="url" {...form.register("website", { required: true })} />
          <p className="text-muted-foreground text-sm">
            URL should start with https://
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Company Social Account</Label>
          <Input
            type="url"
            {...form.register("twitterhandle", { required: true })}
          />
          <p className="text-muted-foreground text-sm">
            URL should start with https://
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Industry</Label>
          <Select
            onValueChange={(value) => {
              form.setValue("superchain_verticals", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {[
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
              ].map((vertical) => (
                <SelectItem
                  key={vertical}
                  value={
                    vertical === "Payments & Finance (DeFi)" ? "DeFi" : vertical
                  }
                >
                  {vertical}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Chain</Label>
          <MultiSelect
            selectedValues={(form.watch("superchain_chain") || "")
              .split(";")
              .filter(Boolean)}
            onSelectedValuesChange={(values) =>
              form.setValue("superchain_chain", values.join(";"))
            }
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
              "Superseed",
              "Ink",
            ].map((chain) => ({
              label: chain === "Optimism" ? "OP Mainnet" : chain,
              value: chain,
            }))}
            placeholder="Select chains"
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Tell us more about your project</Label>
          <Textarea
            {...form.register("what_would_you_like_to_meet_about_")}
            placeholder="Tell us more about your project -- the more you share, the easier you make the approval process."
          />
          <p className="text-muted-foreground text-sm">
            Minimum 150 characters recommended.
          </p>
        </div>
      </div>
      <div className="flex flex-row">
        <Button
          className="w-full"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Applying..." : "Apply now"}
        </Button>
      </div>
    </form>
  );
};
