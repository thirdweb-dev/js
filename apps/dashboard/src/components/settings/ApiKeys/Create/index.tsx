import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type ApiKey,
  type CreateKeyInput,
  useCreateApiKey,
} from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import type { UseMutationResult } from "@tanstack/react-query";
import { SERVICES } from "@thirdweb-dev/service-utils";
import { useTrack } from "hooks/analytics/useTrack";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { toArrFromList } from "utils/string";
import {
  type ApiKeyCreateValidationSchema,
  apiKeyCreateValidationSchema,
} from "../validations";

export type CreateAPIKeyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wording: "project" | "api-key";
  onCreateAndComplete?: () => void;
};

const CreateAPIKeyDialog = (props: CreateAPIKeyDialogProps) => {
  const createKeyMutation = useCreateApiKey();

  return (
    <CreateAPIKeyDialogUI createKeyMutation={createKeyMutation} {...props} />
  );
};

export default CreateAPIKeyDialog;

export const CreateAPIKeyDialogUI = (props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wording: "project" | "api-key";
  onCreateAndComplete?: () => void;
  createKeyMutation: UseMutationResult<
    ApiKey,
    unknown,
    CreateKeyInput,
    unknown
  >;
}) => {
  const [screen, setScreen] = useState<
    { id: "create" } | { id: "api-details"; key: ApiKey }
  >({ id: "create" });
  const { open, onOpenChange, createKeyMutation } = props;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        // Prevent closing the dialog when the API key is created - to make sure user does not accidentally close the dialog without copying the secret key
        if (screen.id === "api-details") {
          return;
        }

        onOpenChange(v);
      }}
    >
      <DialogContent
        className="p-0 z-[10001]"
        dialogOverlayClassName="z-[10000]"
        dialogCloseClassName={screen.id === "api-details" ? "hidden" : ""}
      >
        <DynamicHeight>
          {screen.id === "create" && (
            <CreateAPIKeyForm
              wording={props.wording}
              createKeyMutation={createKeyMutation}
              onAPIKeyCreated={(key) => {
                setScreen({ id: "api-details", key });
              }}
            />
          )}

          {screen.id === "api-details" && (
            <APIKeyDetails
              apiKey={screen.key}
              onComplete={() => {
                onOpenChange(false);
                setScreen({ id: "create" });
                props.onCreateAndComplete?.();
              }}
              wording={props.wording}
            />
          )}
        </DynamicHeight>
      </DialogContent>
    </Dialog>
  );
};

function CreateAPIKeyForm(props: {
  wording: "project" | "api-key";
  createKeyMutation: UseMutationResult<
    ApiKey,
    unknown,
    CreateKeyInput,
    unknown
  >;
  onAPIKeyCreated: (key: ApiKey) => void;
}) {
  const { wording } = props;
  const [showAlert, setShowAlert] = useState<"no-domain" | "any-domain">();

  const { createKeyMutation } = props;
  const trackEvent = useTrack();

  const form = useForm<ApiKeyCreateValidationSchema>({
    resolver: zodResolver(apiKeyCreateValidationSchema),
    defaultValues: {
      name: "",
      domains: "",
    },
  });

  function handleAPICreation(values: {
    name: string;
    domains: string;
  }) {
    const formattedValues = {
      name: values.name,
      domains: toArrFromList(values.domains),
      // enable all services
      services: SERVICES.map((srv) => ({
        name: srv.name,
        targetAddresses: ["*"],
        enabled: true,
        actions: srv.actions.map((sa) => sa.name),
        recoveryShareManagement: "AWS_MANAGED",
        customAuthentication: undefined,
        applicationName: srv.name,
      })),
    };

    trackEvent({
      category: "api-keys",
      action: "create",
      label: "attempt",
    });

    createKeyMutation.mutate(formattedValues, {
      onSuccess: (data) => {
        toast.success(
          `${wording === "api-key" ? "API Key" : "Project"} created successfully`,
        );
        props.onAPIKeyCreated(data);
        trackEvent({
          category: "api-keys",
          action: "create",
          label: "success",
        });
      },
      onError: (err) => {
        toast.error(
          `Failed to create ${wording === "api-key" ? "API Key" : "Project"}`,
        );
        trackEvent({
          category: "api-keys",
          action: "create",
          label: "error",
          error: err,
        });
      },
    });
  }

  const handleSubmit = form.handleSubmit((values) => {
    if (!values.domains) {
      setShowAlert("no-domain");
    } else if (values.domains === "*") {
      setShowAlert("any-domain");
    } else {
      handleAPICreation({
        name: values.name,
        domains: values.domains,
      });
    }
  });

  if (showAlert) {
    return (
      <DomainsAlert
        type={showAlert}
        isCreating={props.createKeyMutation.isPending}
        onProceed={() => {
          handleAPICreation({
            name: form.getValues("name"),
            domains: form.getValues("domains"),
          });
        }}
        onGoBack={() => setShowAlert(undefined)}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl">
              {props.wording === "api-key"
                ? "Create an API Key"
                : "Create a Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {wording === "api-key" ? "Display Name" : "Project Name"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-muted/50"
                      placeholder={
                        wording === "api-key" ? "My API Key" : "My Project"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="relative">
              <CheckboxWithLabel className="absolute top-0 right-0 text-foreground">
                <Checkbox
                  checked={form.watch("domains") === "*"}
                  onCheckedChange={(checked) => {
                    form.setValue("domains", checked ? "*" : "", {
                      shouldDirty: true,
                    });
                  }}
                />
                Allow all domains
              </CheckboxWithLabel>

              <FormField
                control={form.control}
                name="domains"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed Domains</FormLabel>
                    <FormControl>
                      <Textarea
                        className="bg-muted/50"
                        placeholder="thirdweb.com, *.example.com, localhost:3000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="pt-1">
                      <FormDescription className="mb-2 leading-relaxed text-sm">
                        Prevent third-parties from using your Client ID by
                        restricting access to allowed domains. Highly
                        recommended for frontend applications.
                      </FormDescription>

                      <ul className="list-disc text-sm text-muted-foreground pl-3 [&>li]:pl-1 flex flex-col gap-2 ">
                        <li>
                          Authorize all domains with{" "}
                          <span className="bg-muted text-xs font-mono inline-block px-2 rounded">
                            *
                          </span>
                          <br />
                          <span>
                            Example:{" "}
                            <span className="bg-muted text-xs font-mono inline-block px-2 rounded">
                              *.thirdweb.com
                            </span>{" "}
                            accepts all{" "}
                            <span className="bg-muted text-xs font-mono inline-block px-2 rounded">
                              .thirdweb.com
                            </span>{" "}
                            sites
                          </span>
                        </li>
                        <li>
                          Authorize local URLs with{" "}
                          <span className="bg-muted text-xs font-mono inline-block px-2 rounded">
                            {"localhost:<port>"}
                          </span>
                        </li>
                        <li>Separate domains by commas or new lines</li>
                      </ul>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border p-6 bg-muted/50 flex gap-4 md:gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="gap-2 min-w-28">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={props.createKeyMutation.isPending}
            className="gap-2 min-w-28"
          >
            {props.createKeyMutation.isPending && (
              <Spinner className="size-4" />
            )}
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function DomainsAlert(props: {
  type: "no-domain" | "any-domain";
  isCreating: boolean;
  onProceed: () => void;
  onGoBack: () => void;
}) {
  return (
    <div>
      <div className="p-6 mb-4">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {props.type === "no-domain" && "No Domains Configured"}
            {props.type === "any-domain" && "Unrestricted Web Access"}
          </DialogTitle>
          <DialogDescription>
            {props.type === "no-domain" &&
              "This will deny requests from all origins, rendering the key unusable in frontend applications. Proceed only if you intend to use this key in server or native apps environments."}
            {props.type === "any-domain" &&
              "Requests from all origins will be authorized. Your key can be used by any website without restriction"}
          </DialogDescription>
        </DialogHeader>
      </div>

      <DialogFooter className="border-t border-border p-6 bg-muted/50 flex !justify-between gap-4">
        <Button
          variant="outline"
          onClick={props.onGoBack}
          className="gap-2 min-w-28"
        >
          <ArrowLeftIcon className="size-4" />
          Update Domains
        </Button>

        <Button
          type="button"
          onClick={props.onProceed}
          disabled={props.isCreating}
          className="gap-2 min-w-28"
          variant="destructive"
        >
          {props.isCreating && <Spinner className="size-4" />}
          Proceed
        </Button>
      </DialogFooter>
    </div>
  );
}

function APIKeyDetails(props: {
  apiKey: ApiKey;
  onComplete: () => void;
  wording: "project" | "api-key";
}) {
  const { apiKey } = props;
  const [secretStored, setSecretStored] = useState(false);

  return (
    <div>
      <div className="p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">{props.apiKey.name}</DialogTitle>
        </DialogHeader>

        <div className="h-3" />

        <section>
          <h3>Client ID</h3>
          <p className="text-muted-foreground text-sm mb-2">
            Identifies your application.
          </p>

          <CopyTextButton
            textToCopy={apiKey.key}
            className="truncate w-full justify-between font-mono bg-muted/50 px-3 !h-auto py-3"
            textToShow={apiKey.key}
            copyIconPosition="right"
            tooltip="Copy Client ID"
          />
        </section>

        <div className="h-6" />

        <section>
          <h3>Secret Key</h3>
          <p className="text-muted-foreground text-sm mb-2">
            Identifies and authenticates your application from a backend.
          </p>

          <CopyTextButton
            textToCopy={apiKey.secret || ""}
            className="truncate w-full justify-between font-mono bg-muted/50 px-3 !h-auto py-3"
            textToShow={apiKey.secret || ""}
            copyIconPosition="right"
            tooltip="Copy Secret Key"
          />
        </section>

        <div className="h-3" />

        <Alert variant="destructive">
          <AlertTitle>Do not share or expose your secret key</AlertTitle>
          <AlertDescription>
            <div className="mb-5">
              Secret keys cannot be recovered. If you lose your secret key, you
              will need to create a{" "}
              {props.wording === "project" ? "project" : "API key"}
            </div>
            <CheckboxWithLabel className="text-foreground">
              <Checkbox
                checked={secretStored}
                onCheckedChange={(v) => {
                  setSecretStored(!!v);
                }}
              />
              I confirm that I've securely stored my secret key
            </CheckboxWithLabel>
          </AlertDescription>
        </Alert>
      </div>

      <DialogFooter className="border-t border-border p-6 bg-muted/50 flex">
        <Button
          type="button"
          onClick={props.onComplete}
          disabled={!secretStored}
          className="gap-2 min-w-28"
        >
          Complete
        </Button>
      </DialogFooter>
    </div>
  );
}
