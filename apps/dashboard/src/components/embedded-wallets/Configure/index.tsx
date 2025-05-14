"use client";

import type { Project } from "@/api/projects";
import type { SMSCountryTiers } from "@/api/sms";
import type { Team } from "@/api/team";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { cn } from "@/lib/utils";
import { updateProjectClient } from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { ProjectEmbeddedWalletsService } from "@thirdweb-dev/service-utils";
import { GatedSwitch } from "components/settings/Account/Billing/GatedSwitch";
import {
  type ApiKeyEmbeddedWalletsValidationSchema,
  apiKeyEmbeddedWalletsValidationSchema,
} from "components/settings/ApiKeys/validations";
import { useTrack } from "hooks/analytics/useTrack";
import { CircleAlertIcon, PlusIcon, Trash2Icon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { type UseFormReturn, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { upload } from "thirdweb/storage";
import { toArrFromList } from "utils/string";
import { planToTierRecordForGating } from "../../settings/Account/Billing/planToTierRecord";
import { FileInput } from "../../shared/FileInput";
import CountrySelector from "./sms-country-select/country-selector";

type InAppWalletSettingsPageProps = {
  trackingCategory: string;
  project: Project;
  teamId: string;
  teamSlug: string;
  teamPlan: Team["billingPlan"];
  smsCountryTiers: SMSCountryTiers;
};

const TRACKING_CATEGORY = "embedded-wallet";

type UpdateAPIKeyTrackingData = {
  hasCustomBranding: boolean;
  hasCustomJwt: boolean;
  hasCustomAuthEndpoint: boolean;
};

export function InAppWalletSettingsPage(props: InAppWalletSettingsPageProps) {
  const updateProject = useMutation({
    mutationFn: async (projectValues: Partial<Project>) => {
      await updateProjectClient(
        {
          projectId: props.project.id,
          teamId: props.teamId,
        },
        projectValues,
      );
    },
  });

  const { trackingCategory } = props;
  const trackEvent = useTrack();

  function handleUpdateProject(
    projectValues: Partial<Project>,
    trackingData: UpdateAPIKeyTrackingData,
  ) {
    trackEvent({
      category: trackingCategory,
      action: "configuration-update",
      label: "attempt",
    });

    updateProject.mutate(projectValues, {
      onSuccess: () => {
        toast.success("In-App Wallet API Key configuration updated");
        trackEvent({
          category: trackingCategory,
          action: "configuration-update",
          label: "success",
          data: trackingData,
        });
      },
      onError: (err) => {
        toast.error("Failed to update an API Key");
        console.error(err);
        trackEvent({
          category: trackingCategory,
          action: "configuration-update",
          label: "error",
          error: err,
        });
      },
    });
  }

  return (
    <InAppWalletSettingsPageUI
      {...props}
      updateApiKey={handleUpdateProject}
      isUpdating={updateProject.isPending}
      smsCountryTiers={props.smsCountryTiers}
    />
  );
}

const InAppWalletSettingsPageUI: React.FC<
  InAppWalletSettingsPageProps & {
    updateApiKey: (
      projectValues: Partial<Project>,
      trackingData: UpdateAPIKeyTrackingData,
    ) => void;
    isUpdating: boolean;
    smsCountryTiers: SMSCountryTiers;
  }
> = (props) => {
  const embeddedWalletService = props.project.services.find(
    (service) => service.name === "embeddedWallets",
  );

  if (!embeddedWalletService) {
    return (
      <Alert variant="warning">
        <CircleAlertIcon className="size-5" />
        <AlertTitle>In-App wallets service is disabled</AlertTitle>
        <AlertDescription>
          Enable In-App wallets service in the{" "}
          <UnderlineLink
            href={`/team/${props.teamSlug}/${props.project.slug}/settings`}
          >
            project settings
          </UnderlineLink>{" "}
          to configure settings
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <InAppWalletSettingsUI
      {...props}
      embeddedWalletService={embeddedWalletService}
    />
  );
};

export const InAppWalletSettingsUI: React.FC<
  InAppWalletSettingsPageProps & {
    updateApiKey: (
      projectValues: Partial<Project>,
      trackingData: UpdateAPIKeyTrackingData,
    ) => void;
    isUpdating: boolean;
    embeddedWalletService: ProjectEmbeddedWalletsService;
  }
> = (props) => {
  const services = props.project.services;

  const config = props.embeddedWalletService;

  const hasCustomBranding =
    !!config.applicationImageUrl?.length || !!config.applicationName?.length;

  const authRequiredPlan = "accelerate";
  const brandingRequiredPlan = "starter";

  // accelerate or higher plan required
  const canEditSmsCountries =
    planToTierRecordForGating[props.teamPlan] >=
    planToTierRecordForGating[authRequiredPlan];

  const form = useForm<ApiKeyEmbeddedWalletsValidationSchema>({
    resolver: zodResolver(apiKeyEmbeddedWalletsValidationSchema),
    values: {
      customAuthEndpoint: config.customAuthEndpoint || undefined,
      customAuthentication: config.customAuthentication || undefined,
      ...(hasCustomBranding
        ? {
            branding: {
              applicationName: config.applicationName || undefined,
              applicationImageUrl: config.applicationImageUrl || undefined,
            },
          }
        : undefined),
      redirectUrls: (config.redirectUrls || []).join("\n"),
      smsEnabledCountryISOs: config.smsEnabledCountryISOs
        ? config.smsEnabledCountryISOs
        : canEditSmsCountries
          ? ["US", "CA"]
          : [],
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    const { customAuthentication, customAuthEndpoint, branding, redirectUrls } =
      values;

    if (
      customAuthentication &&
      (!customAuthentication.aud.length || !customAuthentication.jwksUri.length)
    ) {
      return toast.error("Custom JSON Web Token configuration is invalid", {
        description:
          "To use In-App Wallets with Custom JSON Web Token, provide JWKS URI and AUD.",
        duration: 9000,
        dismissible: true,
      });
    }

    if (customAuthEndpoint && !customAuthEndpoint.authEndpoint.length) {
      return toast.error(
        "Custom Authentication Endpoint configuration is invalid",
        {
          description:
            "To use In-App Wallets with Custom Authentication Endpoint, provide a valid URL.",
          duration: 9000,
          dismissible: true,
        },
      );
    }

    const newServices = services.map((service) => {
      if (service.name !== "embeddedWallets") {
        return service;
      }

      return {
        ...service,
        customAuthentication,
        customAuthEndpoint,
        applicationImageUrl: branding?.applicationImageUrl,
        applicationName: branding?.applicationName || props.project.name,
        redirectUrls: toArrFromList(redirectUrls || "", true),
        smsEnabledCountryISOs: values.smsEnabledCountryISOs,
      };
    });

    props.updateApiKey(
      {
        services: newServices,
      },
      {
        hasCustomBranding: !!branding,
        hasCustomJwt: !!customAuthentication,
        hasCustomAuthEndpoint: !!customAuthEndpoint,
      },
    );
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="flex flex-col gap-6"
      >
        {/* Branding */}
        <BrandingFieldset
          form={form}
          teamPlan={props.teamPlan}
          teamSlug={props.teamSlug}
          requiredPlan={brandingRequiredPlan}
        />

        <NativeAppsFieldset form={form} />

        {/* Authentication */}
        <Fieldset legend="Authentication">
          <JSONWebTokenFields
            form={form}
            teamPlan={props.teamPlan}
            teamSlug={props.teamSlug}
            requiredPlan={authRequiredPlan}
          />

          <div className="h-5" />

          <AuthEndpointFields
            form={form}
            teamPlan={props.teamPlan}
            teamSlug={props.teamSlug}
            requiredPlan={authRequiredPlan}
          />

          <div className="h-5" />

          <SMSCountryFields
            form={form}
            smsCountryTiers={props.smsCountryTiers}
            teamPlan={props.teamPlan}
            requiredPlan={authRequiredPlan}
            teamSlug={props.teamSlug}
          />
        </Fieldset>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" className="gap-2">
            {props.isUpdating && <Spinner className="size-4" />}
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

function BrandingFieldset(props: {
  form: UseFormReturn<ApiKeyEmbeddedWalletsValidationSchema>;
  teamPlan: Team["billingPlan"];
  teamSlug: string;
  requiredPlan: Team["billingPlan"];
}) {
  return (
    <Fieldset legend="Branding">
      <SwitchContainer
        switchId="branding-switch"
        title="Custom email logo and name"
        description="Pass a custom logo and app name to be used in the emails sent to users."
      >
        <GatedSwitch
          requiredPlan={props.requiredPlan}
          teamSlug={props.teamSlug}
          trackingLabel="customEmailLogoAndName"
          currentPlan={props.teamPlan}
          switchProps={{
            id: "branding-switch",
            checked: !!props.form.watch("branding"),
            onCheckedChange: (checked) =>
              props.form.setValue(
                "branding",
                checked
                  ? {
                      applicationImageUrl: "",
                      applicationName: "",
                    }
                  : undefined,
              ),
          }}
        />
      </SwitchContainer>

      <GatedCollapsibleContainer
        requiredPlan={props.requiredPlan}
        currentPlan={props.teamPlan}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        isExpanded={!!props.form.watch("branding")}
      >
        {/* Application Image */}
        <FormField
          control={props.form.control}
          name="branding.applicationImageUrl"
          render={() => (
            <FormItem className="space-y-1">
              <FormLabel>Application Image URL</FormLabel>
              <FormDescription className="!mb-4">
                Logo that will display in the emails sent to users.{" "}
                <br className="max-sm:hidden" /> The image must be squared with
                recommended size of 72x72 px.
              </FormDescription>
              <FormControl>
                <AppImageFormControl
                  uri={props.form.watch("branding.applicationImageUrl")}
                  setUri={(uri) => {
                    props.form.setValue("branding.applicationImageUrl", uri, {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Application Name */}
        <FormField
          control={props.form.control}
          name="branding.applicationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Name</FormLabel>
              <FormDescription className="!mb-2">
                Name that will be displayed in the emails sent to users.{" "}
                <br className="max-sm:hidden" /> Defaults to your API Key's
                name.
              </FormDescription>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </GatedCollapsibleContainer>
    </Fieldset>
  );
}

function AppImageFormControl(props: {
  uri: string | undefined;
  setUri: (uri: string) => void;
}) {
  const client = useThirdwebClient();
  const [image, setImage] = useState<File | undefined>();
  const resolveUrl = resolveSchemeWithErrorHandler({
    client: client,
    uri: props.uri || undefined,
  });

  const uploadImage = useMutation({
    mutationFn: async (file: File) => {
      const uri = await upload({
        client: client,
        files: [file],
      });

      return uri;
    },
  });

  return (
    <div className="flex">
      <div className="relative">
        <FileInput
          accept={{ "image/*": [] }}
          value={image}
          setValue={async (v) => {
            try {
              setImage(v);
              const uri = await uploadImage.mutateAsync(v);
              props.setUri(uri);
            } catch (error) {
              setImage(undefined);
              toast.error("Failed to upload image", {
                description: error instanceof Error ? error.message : undefined,
              });
            }
          }}
          className="w-24 rounded-full bg-background lg:w-28"
          disableHelperText
          fileUrl={resolveUrl}
        />

        {uploadImage.isPending && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full border bg-background/50">
            <Spinner className="size-7" />
          </div>
        )}
      </div>
    </div>
  );
}

function SMSCountryFields(props: {
  form: UseFormReturn<ApiKeyEmbeddedWalletsValidationSchema>;
  smsCountryTiers: SMSCountryTiers;
  teamPlan: Team["billingPlan"];
  requiredPlan: Team["billingPlan"];
  teamSlug: string;
}) {
  return (
    <div>
      <SwitchContainer
        switchId="sms-switch"
        title="SMS"
        description="Optionally allow users in selected countries to login via SMS OTP."
      >
        <GatedSwitch
          currentPlan={props.teamPlan}
          requiredPlan={props.requiredPlan}
          teamSlug={props.teamSlug}
          switchProps={{
            id: "sms-switch",
            checked: !!props.form.watch("smsEnabledCountryISOs").length,
            onCheckedChange: (checked) =>
              props.form.setValue(
                "smsEnabledCountryISOs",
                checked
                  ? // by default, enable US and CA only
                    ["US", "CA"]
                  : [],
              ),
          }}
          trackingLabel="sms"
        />
      </SwitchContainer>

      <GatedCollapsibleContainer
        className="grid grid-cols-1"
        currentPlan={props.teamPlan}
        requiredPlan={props.requiredPlan}
        isExpanded={!!props.form.watch("smsEnabledCountryISOs").length}
      >
        <FormField
          control={props.form.control}
          name="smsEnabledCountryISOs"
          render={({ field }) => (
            <CountrySelector
              countryTiers={props.smsCountryTiers}
              selected={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </GatedCollapsibleContainer>
    </div>
  );
}

function JSONWebTokenFields(props: {
  form: UseFormReturn<ApiKeyEmbeddedWalletsValidationSchema>;
  teamPlan: Team["billingPlan"];
  teamSlug: string;
  requiredPlan: Team["billingPlan"];
}) {
  return (
    <div>
      <SwitchContainer
        switchId="authentication-switch"
        title="Custom JSON Web Token"
        description={
          <>
            Optionally allow users to authenticate with a custom JWT.{" "}
            <TrackedLinkTW
              target="_blank"
              href="https://portal.thirdweb.com/connect/in-app-wallet/custom-auth/custom-jwt-auth-server"
              label="learn-more"
              category={TRACKING_CATEGORY}
              className="text-link-foreground hover:text-foreground"
            >
              Learn more
            </TrackedLinkTW>
          </>
        }
      >
        <GatedSwitch
          trackingLabel="customAuthJWT"
          currentPlan={props.teamPlan}
          requiredPlan={props.requiredPlan}
          teamSlug={props.teamSlug}
          switchProps={{
            id: "authentication-switch",
            checked: !!props.form.watch("customAuthentication"),
            onCheckedChange: (checked) => {
              props.form.setValue(
                "customAuthentication",
                checked ? { jwksUri: "", aud: "" } : undefined,
              );
            },
          }}
        />
      </SwitchContainer>

      <GatedCollapsibleContainer
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        isExpanded={!!props.form.watch("customAuthentication")}
        currentPlan={props.teamPlan}
        requiredPlan={props.requiredPlan}
      >
        <FormField
          control={props.form.control}
          name="customAuthentication.jwksUri"
          render={({ field }) => (
            <FormItem>
              <FormLabel>JWKS URI</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://example.com/.well-known/jwks.json"
                />
              </FormControl>
              <FormDescription>Enter the URI of the JWKS</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={props.form.control}
          name="customAuthentication.aud"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AUD Value</FormLabel>
              <FormControl>
                <Input {...field} placeholder="AUD" />
              </FormControl>
              <FormDescription>
                Enter the audience claim for the JWT
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </GatedCollapsibleContainer>
    </div>
  );
}

function AuthEndpointFields(props: {
  form: UseFormReturn<ApiKeyEmbeddedWalletsValidationSchema>;
  teamPlan: Team["billingPlan"];
  teamSlug: string;
  requiredPlan: Team["billingPlan"];
}) {
  const expandCustomAuthEndpointField =
    props.form.watch("customAuthEndpoint") !== undefined;

  return (
    <div>
      <SwitchContainer
        switchId="auth-endpoint-switch"
        title="Custom Authentication Endpoint"
        description={
          <>
            Optionally allow users to authenticate with any arbitrary payload
            that you provide.{" "}
            <TrackedLinkTW
              target="_blank"
              href="https://portal.thirdweb.com/connect/in-app-wallet/custom-auth/custom-auth-server"
              label="learn-more"
              category={TRACKING_CATEGORY}
              className="text-link-foreground hover:text-foreground"
            >
              Learn more
            </TrackedLinkTW>
          </>
        }
      >
        <GatedSwitch
          trackingLabel="customAuthEndpoint"
          switchProps={{
            id: "auth-endpoint-switch",
            checked: expandCustomAuthEndpointField,
            onCheckedChange: (checked) => {
              props.form.setValue(
                "customAuthEndpoint",
                checked
                  ? {
                      authEndpoint: "",
                      customHeaders: [],
                    }
                  : undefined,
              );
            },
          }}
          currentPlan={props.teamPlan}
          requiredPlan={props.requiredPlan}
          teamSlug={props.teamSlug}
        />
      </SwitchContainer>

      {/* useFieldArray used on this component - it creates empty customAuthEndpoint.customHeaders array on mount */}
      {/* So only mount if expandCustomAuthEndpointField is true */}
      {expandCustomAuthEndpointField && (
        <AuthEndpointFieldsContent form={props.form} />
      )}
    </div>
  );
}

function AuthEndpointFieldsContent(props: {
  form: UseFormReturn<ApiKeyEmbeddedWalletsValidationSchema>;
}) {
  const customHeaderFields = useFieldArray({
    control: props.form.control,
    name: "customAuthEndpoint.customHeaders",
  });

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <FormField
        control={props.form.control}
        name="customAuthEndpoint.authEndpoint"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Authentication Endpoint</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="https://example.com/your-auth-verifier"
              />
            </FormControl>
            <FormDescription>
              Enter the URL of your server where we will send the user payload
              for verification
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <Label className="mb-3 inline-block">Custom Headers</Label>
        <div className="flex flex-col gap-4">
          {customHeaderFields.fields.map((field, customHeaderIdx) => {
            return (
              <div className="flex gap-4" key={field.id}>
                <Input
                  placeholder="Name"
                  type="text"
                  {...props.form.register(
                    `customAuthEndpoint.customHeaders.${customHeaderIdx}.key`,
                  )}
                />
                <Input
                  placeholder="Value"
                  type="text"
                  {...props.form.register(
                    `customAuthEndpoint.customHeaders.${customHeaderIdx}.value`,
                  )}
                />
                <Button
                  variant="outline"
                  aria-label="Remove header"
                  onClick={() => {
                    customHeaderFields.remove(customHeaderIdx);
                  }}
                  className="!w-auto px-3"
                >
                  <Trash2Icon className="size-4 shrink-0 text-destructive-text" />
                </Button>
              </div>
            );
          })}

          <Button
            variant="outline"
            className="w-full gap-2 bg-background"
            onClick={() => {
              customHeaderFields.append({
                key: "",
                value: "",
              });
            }}
          >
            <PlusIcon className="size-4" />
            Add header
          </Button>
        </div>

        <p className="mt-3 text-muted-foreground text-sm">
          Set custom headers to be sent along the request with the payload to
          the authentication endpoint above. This can be used to verify the
          incoming requests
        </p>
      </div>
    </div>
  );
}

function NativeAppsFieldset(props: {
  form: UseFormReturn<ApiKeyEmbeddedWalletsValidationSchema>;
}) {
  const { form } = props;
  return (
    <Fieldset legend="Native Apps">
      <FormField
        control={form.control}
        name="redirectUrls"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Allowed redirect URIs</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="appName://, localhost:3000, https://example.com"
              />
            </FormControl>
            <FormDescription>
              Enter redirect URIs separated by commas or new lines. This is
              often your application's deep link.
              <br className="max-sm:hidden" />
              Currently only used in Unity, Unreal Engine and React Native
              platform when users authenticate through social logins.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </Fieldset>
  );
}

function GatedCollapsibleContainer(props: {
  children: React.ReactNode;
  isExpanded: boolean;
  className?: string;
  requiredPlan: Team["billingPlan"];
  currentPlan: Team["billingPlan"];
}) {
  const upgradeRequired =
    planToTierRecordForGating[props.currentPlan] <
    planToTierRecordForGating[props.requiredPlan];

  if (!props.isExpanded || upgradeRequired) {
    return null;
  }

  return <div className={cn("mt-6", props.className)}>{props.children}</div>;
}

function Fieldset(props: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <DynamicHeight>
      <fieldset className="rounded-lg border border-border bg-card p-4 md:p-6">
        {/* put inside div to remove default styles on legend  */}
        <div className="mb-4 font-semibold text-xl tracking-tight">
          <legend> {props.legend}</legend>
        </div>

        {props.children}
      </fieldset>
    </DynamicHeight>
  );
}

function SwitchContainer(props: {
  switchId: string;
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <Label htmlFor={props.switchId} className="text-base">
          {props.title}
        </Label>
        <p className="mt-0.5 text-muted-foreground text-sm ">
          {props.description}
        </p>
      </div>
      {props.children}
    </div>
  );
}
