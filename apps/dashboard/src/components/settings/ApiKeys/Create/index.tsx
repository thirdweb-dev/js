import type { Project } from "@/api/projects";
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
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { createProjectClient } from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import type { ProjectService } from "@thirdweb-dev/service-utils";
import { SERVICES } from "@thirdweb-dev/service-utils";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { toArrFromList } from "utils/string";
import { z } from "zod";
import { projectDomainsSchema, projectNameSchema } from "../validations";

const ALL_PROJECT_SERVICES = SERVICES.filter(
  (srv) =>
    srv.name !== "relayer" &&
    srv.name !== "chainsaw" &&
    srv.name !== "engineCloud", // TODO enable once API server is out
);

export type CreateProjectPrefillOptions = {
  name?: string;
  domains?: string;
};

export type CreateProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAndComplete?: () => void;
  prefill?: CreateProjectPrefillOptions;
  enableNebulaServiceByDefault: boolean;
  teamId: string;
  teamSlug: string;
};

const CreateProjectDialog = (props: CreateProjectDialogProps) => {
  return (
    <CreateProjectDialogUI
      createProject={async (params) => {
        const res = await createProjectClient(props.teamId, params);
        return {
          project: res.project,
          secret: res.secret,
        };
      }}
      {...props}
    />
  );
};

export default CreateProjectDialog;

export const CreateProjectDialogUI = (props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAndComplete?: () => void;
  createProject: (param: Partial<Project>) => Promise<{
    project: Project;
    secret: string;
  }>;
  prefill?: CreateProjectPrefillOptions;
  enableNebulaServiceByDefault: boolean;
  teamSlug: string;
}) => {
  const [screen, setScreen] = useState<
    { id: "create" } | { id: "api-details"; project: Project; secret: string }
  >({ id: "create" });
  const { open, onOpenChange } = props;

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
        className="overflow-hidden p-0"
        dialogCloseClassName={screen.id === "api-details" ? "hidden" : ""}
      >
        <DynamicHeight>
          {screen.id === "create" && (
            <CreateProjectForm
              createProject={props.createProject}
              onProjectCreated={(params) => {
                setScreen({
                  id: "api-details",
                  project: params.project,
                  secret: params.secret,
                });
              }}
              prefill={props.prefill}
              enableNebulaServiceByDefault={props.enableNebulaServiceByDefault}
            />
          )}

          {screen.id === "api-details" && (
            <CreatedProjectDetails
              project={screen.project}
              secret={screen.secret}
              teamSlug={props.teamSlug}
              onComplete={() => {
                onOpenChange(false);
                setScreen({ id: "create" });
                props.onCreateAndComplete?.();
              }}
            />
          )}
        </DynamicHeight>
      </DialogContent>
    </Dialog>
  );
};

const createProjectFormSchema = z.object({
  name: projectNameSchema,
  domains: projectDomainsSchema,
});

type CreateProjectFormSchema = z.infer<typeof createProjectFormSchema>;

function CreateProjectForm(props: {
  createProject: (param: Partial<Project>) => Promise<{
    project: Project;
    secret: string;
  }>;
  prefill?: CreateProjectPrefillOptions;
  enableNebulaServiceByDefault: boolean;
  onProjectCreated: (params: {
    project: Project;
    secret: string;
  }) => void;
}) {
  const [showAlert, setShowAlert] = useState<"no-domain" | "any-domain">();
  const createProject = useMutation({
    mutationFn: props.createProject,
  });

  const form = useForm<CreateProjectFormSchema>({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      name: props.prefill?.name || "",
      domains: props.prefill?.domains || "",
    },
  });

  function handleAPICreation(values: {
    name: string;
    domains: string;
  }) {
    const servicesToEnableByDefault = props.enableNebulaServiceByDefault
      ? ALL_PROJECT_SERVICES
      : ALL_PROJECT_SERVICES.filter((srv) => srv.name !== "nebula");

    const formattedValues: Partial<Project> = {
      name: values.name,
      domains: toArrFromList(values.domains),
      // enable all services
      services: servicesToEnableByDefault.map((srv) => {
        if (srv.name === "storage") {
          return {
            name: srv.name,
            actions: srv.actions.map((sa) => sa.name),
          } satisfies ProjectService;
        }

        if (srv.name === "pay") {
          return {
            name: "pay",
            payoutAddress: null,
            actions: [],
          } satisfies ProjectService;
        }

        return {
          name: srv.name,
          actions: [],
        } satisfies ProjectService;
      }),
    };

    createProject.mutate(formattedValues, {
      onSuccess: (data) => {
        props.onProjectCreated(data);
        toast.success("Project created successfully");
      },
      onError: () => {
        toast.error("Failed to create a project");
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
        isCreating={createProject.isPending}
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
            <DialogTitle className="text-2xl">Create Project</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-card"
                      placeholder="My Project"
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
                        className="bg-card"
                        placeholder="thirdweb.com, *.example.com, localhost:3000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="pt-1">
                      <FormDescription className="mb-2 text-sm leading-relaxed">
                        Prevent third-parties from using your Client ID by
                        restricting access to allowed domains. Highly
                        recommended for frontend applications.
                      </FormDescription>

                      <ul className="flex list-disc flex-col gap-2 pl-3 text-muted-foreground text-sm [&>li]:pl-1 ">
                        <li>
                          Authorize all domains with{" "}
                          <span className="inline-block rounded bg-muted px-2 font-mono text-xs">
                            *
                          </span>
                          <br />
                          <span>
                            Example:{" "}
                            <span className="inline-block rounded bg-muted px-2 font-mono text-xs">
                              *.thirdweb.com
                            </span>{" "}
                            accepts all{" "}
                            <span className="inline-block rounded bg-muted px-2 font-mono text-xs">
                              .thirdweb.com
                            </span>{" "}
                            sites
                          </span>
                        </li>
                        <li>
                          Authorize local URLs with{" "}
                          <span className="inline-block rounded bg-muted px-2 font-mono text-xs">
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

        <DialogFooter className="flex gap-4 border-border border-t bg-card p-6 md:gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="min-w-28 gap-2">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={createProject.isPending}
            className="min-w-28 gap-2"
          >
            {createProject.isPending && <Spinner className="size-4" />}
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
      <div className="mb-4 p-6">
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

      <DialogFooter className="!justify-between flex gap-4 border-border border-t bg-card p-6">
        <Button
          variant="outline"
          onClick={props.onGoBack}
          className="min-w-28 gap-2"
        >
          <ArrowLeftIcon className="size-4" />
          Update Domains
        </Button>

        <Button
          type="button"
          onClick={props.onProceed}
          disabled={props.isCreating}
          className="min-w-28 gap-2"
          variant="destructive"
        >
          {props.isCreating && <Spinner className="size-4" />}
          Proceed
        </Button>
      </DialogFooter>
    </div>
  );
}

function CreatedProjectDetails(props: {
  project: Project;
  secret: string;
  onComplete: () => void;
  teamSlug: string | undefined;
}) {
  const [secretStored, setSecretStored] = useState(false);
  const router = useDashboardRouter();

  const clientId = props.project.publishableKey;

  return (
    <div>
      <div className="p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">{props.project.name}</DialogTitle>
        </DialogHeader>

        <div className="h-3" />

        <section>
          <h3>Client ID</h3>
          <p className="mb-2 text-muted-foreground text-sm">
            Identifies your application.
          </p>

          <CopyTextButton
            textToCopy={clientId}
            className="!h-auto w-full justify-between truncate bg-card px-3 py-3 font-mono"
            textToShow={clientId}
            copyIconPosition="right"
            tooltip="Copy Client ID"
          />
        </section>

        <div className="h-6" />

        <section>
          <h3>Secret Key</h3>
          <p className="mb-2 text-muted-foreground text-sm">
            Identifies and authenticates your application from a backend.
          </p>

          <CopyTextButton
            textToCopy={props.secret || ""}
            className="!h-auto w-full justify-between truncate bg-card px-3 py-3 font-mono"
            textToShow={props.secret || ""}
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
              will need to rotate the secret key or create a new Project.
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

      <DialogFooter className="flex border-border border-t bg-card p-6">
        <Button
          type="button"
          onClick={props.onComplete}
          disabled={!secretStored}
          variant="outline"
          className="min-w-28 gap-2"
        >
          {props.teamSlug ? "Close" : "Complete"}
        </Button>

        {props.teamSlug && (
          <Button
            onClick={() => {
              router.push(`/team/${props.teamSlug}/${props.project.slug}`);
            }}
            disabled={!secretStored}
            className="min-w-28 gap-2"
          >
            View Project
            <ArrowRightIcon className="size-4" />
          </Button>
        )}
      </DialogFooter>
    </div>
  );
}
