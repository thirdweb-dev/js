"use client";

import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Spinner } from "@/components/ui/Spinner/Spinner";
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
import { cn } from "@/lib/utils";
import {
  type Account,
  type ApiKey,
  type ApiKeyService,
  type UpdateKeyInput,
  useUpdateApiKey,
} from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { GatedSwitch } from "components/settings/Account/Billing/GatedSwitch";
import {
  type ApiKeyEmbeddedWalletsValidationSchema,
  apiKeyEmbeddedWalletsValidationSchema,
} from "components/settings/ApiKeys/validations";
import { useTrack } from "hooks/analytics/useTrack";
import { PlusIcon, Trash2Icon } from "lucide-react";
import type React from "react";
import { type UseFormReturn, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { toArrFromList } from "utils/string";

type InAppWalletSettingsPageProps = {
  apiKey: Pick<
    ApiKey,
    "id" | "name" | "domains" | "bundleIds" | "services" | "redirectUrls"
  >;
  trackingCategory: string;
  twAccount: Account;
};

const TRACKING_CATEGORY = "embedded-wallet";

type UpdateAPIKeyTrackingData = {
  hasCustomBranding: boolean;
  hasCustomJwt: boolean;
  hasCustomAuthEndpoint: boolean;
};

export function InAppWalletSettingsPage(props: InAppWalletSettingsPageProps) {
  const mutation = useUpdateApiKey();
  const { trackingCategory } = props;
  const trackEvent = useTrack();

  function handleAPIKeyUpdate(
    newValue: UpdateKeyInput,
    trackingData: UpdateAPIKeyTrackingData,
  ) {
    trackEvent({
      category: trackingCategory,
      action: "configuration-update",
      label: "attempt",
    });

    mutation.mutate(newValue, {
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
    <InAppWalletSettingsUI
      {...props}
      canEditAdvancedFeatures={props.twAccount.advancedEnabled}
      updateApiKey={handleAPIKeyUpdate}
      isUpdating={mutation.isPending}
    />
  );
}

export const InAppWalletSettingsUI: React.FC<
  InAppWalletSettingsPageProps & {
    canEditAdvancedFeatures: boolean;
    updateApiKey: (
      apiKey: UpdateKeyInput,
      trackingData: UpdateAPIKeyTrackingData,
    ) => void;
    isUpdating: boolean;
  }
> = (props) => {
  const { canEditAdvancedFeatures, apiKey } = props;
  const services: ApiKeyService[] = apiKey.services || [];

  const serviceIdx = services.findIndex(
    (srv) => srv.name === "embeddedWallets",
  );
  const config: ApiKeyService | undefined = services[serviceIdx];

  const hasCustomBranding =
    !!config?.applicationImageUrl?.length || !!config?.applicationName?.length;

  const form = useForm<ApiKeyEmbeddedWalletsValidationSchema>({
    resolver: zodResolver(apiKeyEmbeddedWalletsValidationSchema),
    values: {
      customAuthEndpoint: config?.customAuthEndpoint,
      customAuthentication: config?.customAuthentication,
      ...(hasCustomBranding
        ? {
            branding: {
              applicationName: config.applicationName,
              applicationImageUrl: config.applicationImageUrl,
            },
          }
        : undefined),
      redirectUrls: apiKey.redirectUrls.join("\n"),
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

    const { id, name, domains, bundleIds } = apiKey;

    // FIXME: This must match components/settings/ApiKeys/Edit/index.tsx
    //        Make it more generic w/o me thinking of values
    const newServices = [...services];

    if (services[serviceIdx]) {
      newServices[serviceIdx] = {
        ...services[serviceIdx],
        customAuthentication,
        customAuthEndpoint,
        applicationImageUrl: branding?.applicationImageUrl,
        applicationName: branding?.applicationName || apiKey.name,
      };
    }

    props.updateApiKey(
      {
        id,
        name,
        domains,
        bundleIds,
        redirectUrls: toArrFromList(redirectUrls || "", true),
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
          canEditAdvancedFeatures={canEditAdvancedFeatures}
        />

        {/* Authentication */}
        <Fieldset legend="Authentication">
          <JSONWebTokenFields
            form={form}
            canEditAdvancedFeatures={canEditAdvancedFeatures}
          />

          <div className="h-5" />

          <AuthEndpointFields
            form={form}
            canEditAdvancedFeatures={canEditAdvancedFeatures}
          />
        </Fieldset>

        <NativeAppsFieldset form={form} />

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
  canEditAdvancedFeatures: boolean;
}) {
  const { form, canEditAdvancedFeatures } = props;

  return (
    <Fieldset legend="Branding">
      <SwitchContainer
        switchId="branding-switch"
        title="Custom email logo and name"
        description="Pass a custom logo and app name to be used in the emails sent to users."
      >
        <GatedSwitch
          id="branding-switch"
          trackingLabel="customEmailLogoAndName"
          checked={!!form.watch("branding") && canEditAdvancedFeatures}
          upgradeRequired={!canEditAdvancedFeatures}
          onCheckedChange={(checked) =>
            form.setValue(
              "branding",
              checked
                ? {
                    applicationImageUrl: "",
                    applicationName: "",
                  }
                : undefined,
            )
          }
        />
      </SwitchContainer>

      <AdvancedConfigurationContainer
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        show={canEditAdvancedFeatures && !!form.watch("branding")}
      >
        {/* Application Name */}
        <FormField
          control={form.control}
          name="branding.applicationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Name that will be displayed in the emails sent to users.{" "}
                <br className="max-sm:hidden" /> Defaults to your API Key's
                name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Application Image */}
        <FormField
          control={form.control}
          name="branding.applicationImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Image URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Logo that will display in the emails sent to users.{" "}
                <br className="max-sm:hidden" /> The image must be squared with
                recommended size of 72x72 px.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </AdvancedConfigurationContainer>
    </Fieldset>
  );
}

function JSONWebTokenFields(props: {
  form: UseFormReturn<ApiKeyEmbeddedWalletsValidationSchema>;
  canEditAdvancedFeatures: boolean;
}) {
  const { form, canEditAdvancedFeatures } = props;

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
          id="authentication-switch"
          upgradeRequired={!canEditAdvancedFeatures}
          trackingLabel="customAuthJWT"
          checked={
            !!form.watch("customAuthentication") && canEditAdvancedFeatures
          }
          onCheckedChange={(checked) => {
            form.setValue(
              "customAuthentication",
              checked
                ? {
                    jwksUri: "",
                    aud: "",
                  }
                : undefined,
            );
          }}
        />
      </SwitchContainer>

      <AdvancedConfigurationContainer
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        show={canEditAdvancedFeatures && !!form.watch("customAuthentication")}
      >
        <FormField
          control={form.control}
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
          control={form.control}
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
      </AdvancedConfigurationContainer>
    </div>
  );
}

function AuthEndpointFields(props: {
  form: UseFormReturn<ApiKeyEmbeddedWalletsValidationSchema>;
  canEditAdvancedFeatures: boolean;
}) {
  const { form, canEditAdvancedFeatures } = props;

  const expandCustomAuthEndpointField =
    form.watch("customAuthEndpoint") !== undefined && canEditAdvancedFeatures;

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
          checked={expandCustomAuthEndpointField}
          upgradeRequired={!canEditAdvancedFeatures}
          onCheckedChange={(checked) => {
            form.setValue(
              "customAuthEndpoint",
              checked
                ? {
                    authEndpoint: "",
                    customHeaders: [],
                  }
                : undefined,
            );
          }}
        />
      </SwitchContainer>
      {/* useFieldArray used on this component - it creates empty customAuthEndpoint.customHeaders array on mount */}
      {/* So only mount if expandCustomAuthEndpointField is true */}
      {expandCustomAuthEndpointField && (
        <AuthEndpointFieldsContent
          form={form}
          canEditAdvancedFeatures={canEditAdvancedFeatures}
        />
      )}
    </div>
  );
}

function AuthEndpointFieldsContent(props: {
  form: UseFormReturn<ApiKeyEmbeddedWalletsValidationSchema>;
  canEditAdvancedFeatures: boolean;
}) {
  const { form } = props;

  const customHeaderFields = useFieldArray({
    control: form.control,
    name: "customAuthEndpoint.customHeaders",
  });

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <FormField
        control={form.control}
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
                  {...form.register(
                    `customAuthEndpoint.customHeaders.${customHeaderIdx}.key`,
                  )}
                />
                <Input
                  placeholder="Value"
                  type="text"
                  {...form.register(
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

function AdvancedConfigurationContainer(props: {
  children: React.ReactNode;
  show: boolean;
  className?: string;
}) {
  if (!props.show) {
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
        {/* put inside div to remove defualt styles on legend  */}
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
