"use client";
import type { RotateSecretKeyAPIReturnType } from "@3rdweb-sdk/react/hooks/useApi";
import {
  deleteProjectClient,
  rotateSecretKeyClient,
  updateProjectClient,
} from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { ProjectService } from "@thirdweb-dev/service-utils";
import {
  getServiceByName,
  SERVICES,
  type ServiceName,
} from "@thirdweb-dev/service-utils";
import {
  HIDDEN_SERVICES,
  projectDomainsSchema,
  projectNameSchema,
} from "components/settings/ApiKeys/validations";
import { FileInput } from "components/shared/FileInput";
import { format } from "date-fns";
import {
  CircleAlertIcon,
  ExternalLinkIcon,
  RefreshCcwIcon,
  TriangleAlertIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  type FieldArrayWithId,
  type UseFormReturn,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";
import { RE_BUNDLE_ID } from "utils/regex";
import { joinWithComma, toArrFromList } from "utils/string";
import { validStrList } from "utils/validations";
import { z } from "zod";
import { apiServerProxy } from "@/actions/proxies";
import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { GradientAvatar } from "@/components/blocks/Avatars/GradientAvatar";
import { DangerSettingCard } from "@/components/blocks/DangerSettingCard";
import { SettingsCard } from "@/components/blocks/SettingsCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { cn } from "@/lib/utils";

// TODO: instead of single submit handler, move the submit to each section

const projectSettingsFormSchema = z.object({
  bundleIds: z.string().refine((str) => validStrList(str, RE_BUNDLE_ID), {
    message: "Some of the bundle ids are invalid",
  }),
  domains: projectDomainsSchema,
  name: projectNameSchema,
  servicesMeta: z.array(
    z.object({
      actions: z.array(z.string()),
      enabled: z.boolean(),
      name: z.string(),
    }),
  ),
});

type ProjectSettingsPageFormSchema = z.infer<typeof projectSettingsFormSchema>;

type ProjectSettingPaths = {
  inAppConfig: string;
  aaConfig: string;
  payConfig: string;
  afterDeleteRedirectTo: string;
};

type TeamWithRole = {
  role: "MEMBER" | "OWNER";
  team: Team;
};

export function ProjectGeneralSettingsPage(props: {
  project: Project;
  teamSlug: string;
  teamId: string;
  showNebulaSettings: boolean;
  teamsWithRole: TeamWithRole[];
  client: ThirdwebClient;
  isOwnerAccount: boolean;
}) {
  const router = useDashboardRouter();

  return (
    <ProjectGeneralSettingsPageUI
      client={props.client}
      deleteProject={async () => {
        await deleteProjectClient({
          projectId: props.project.id,
          teamId: props.project.teamId,
        });
      }}
      isOwnerAccount={props.isOwnerAccount}
      onKeyUpdated={() => {
        router.refresh();
      }}
      project={props.project}
      rotateSecretKey={async () => {
        return rotateSecretKeyClient({
          projectId: props.project.id,
          teamId: props.project.teamId,
        });
      }}
      showNebulaSettings={props.showNebulaSettings}
      teamSlug={props.teamSlug}
      teamsWithRole={props.teamsWithRole}
      transferProject={async (newTeam) => {
        const res = await apiServerProxy({
          body: JSON.stringify({
            destinationTeamId: newTeam.id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          pathname: `/v1/teams/${props.teamId}/projects/${props.project.id}/transfer`,
        });

        if (!res.ok) {
          console.error(res.error);
          throw new Error(res.error);
        }

        // Can't open new project in new team or new team landing pagae because it takes a while for the transfer and it doesn't show up in new team immediately
        // so the safe option is to just redirect to the current team landing page
        router.replace(`/team/${props.teamSlug}`);
      }}
      updateProject={async (projectValues) => {
        return updateProjectClient(
          {
            projectId: props.project.id,
            teamId: props.project.teamId,
          },
          projectValues,
        );
      }}
      updateProjectImage={async (file) => {
        let uri: string | undefined;

        if (file) {
          // upload to IPFS
          uri = await upload({
            client: props.client,
            files: [file],
          });
        }

        await updateProjectClient(
          {
            projectId: props.project.id,
            teamId: props.project.teamId,
          },
          {
            image: uri,
          },
        );

        router.refresh();
      }}
    />
  );
}

type UpdateProject = (project: Partial<Project>) => Promise<Project>;
type DeleteProject = () => Promise<void>;
type RotateSecretKey = () => Promise<RotateSecretKeyAPIReturnType>;
type UpdateAPIForm = UseFormReturn<ProjectSettingsPageFormSchema>;

export function ProjectGeneralSettingsPageUI(props: {
  project: Project;
  updateProject: UpdateProject;
  deleteProject: DeleteProject;
  onKeyUpdated: (() => void) | undefined;
  showNebulaSettings: boolean;
  rotateSecretKey: RotateSecretKey;
  teamSlug: string;
  teamsWithRole: TeamWithRole[];
  client: ThirdwebClient;
  transferProject: (newTeam: Team) => Promise<void>;
  isOwnerAccount: boolean;
  updateProjectImage: (file: File | undefined) => Promise<void>;
}) {
  const projectLayout = `/team/${props.teamSlug}/${props.project.slug}`;

  const paths = {
    aaConfig: `${projectLayout}/connect/account-abstraction/settings`,
    afterDeleteRedirectTo: `/team/${props.teamSlug}`,
    inAppConfig: `${projectLayout}/connect/in-app-wallets/settings`,
    payConfig: `${projectLayout}/connect/universal-bridge/settings`,
  };

  const { project } = props;

  const router = useDashboardRouter();
  const updateProject = useMutation({
    mutationFn: props.updateProject,
  });

  const form = useForm<ProjectSettingsPageFormSchema>({
    defaultValues: {
      bundleIds: joinWithComma(project.bundleIds),
      domains: joinWithComma(project.domains),
      name: project.name,
      servicesMeta: SERVICES.map((service) => {
        const projectService = project.services.find(
          (projectService) => projectService.name === service.name,
        );

        return {
          actions: projectService?.actions || [],
          enabled: !!projectService,
          name: service.name as ServiceName,
        };
      }),
    },
    resolver: zodResolver(projectSettingsFormSchema),
  });

  const handleSubmit = form.handleSubmit((values) => {
    const services: ProjectService[] = [];

    for (const serviceMeta of values.servicesMeta) {
      if (serviceMeta.enabled) {
        function getBaseService(): ProjectService {
          const projectService = project.services.find(
            (s) => s.name === serviceMeta.name,
          );

          if (projectService) {
            return projectService;
          }

          if (serviceMeta.name === "pay") {
            return {
              actions: [],
              name: "pay",
              payoutAddress: null,
            };
          }

          return {
            actions: [],
            name: serviceMeta.name as Exclude<ProjectService["name"], "pay">,
          };
        }

        const serviceToAdd = getBaseService();

        // add the actions changes to the base service
        if (serviceMeta.name === "storage") {
          serviceToAdd.actions = serviceMeta.actions as ("read" | "write")[];
          services.push(serviceToAdd);
        }

        services.push(serviceToAdd);
      }
    }

    if (services.length === 0) {
      return toast.error("No services selected", {
        description: "Please select at least one service",
      });
    }

    const projectValues: Partial<Project> = {
      bundleIds: toArrFromList(values.bundleIds),
      domains: toArrFromList(values.domains),
      id: project.id,
      name: values.name,
      services,
    };

    updateProject.mutate(projectValues, {
      onError: (err) => {
        toast.error("Failed to update project");
        console.error(err);
      },
      onSuccess: () => {
        toast.success("Project updated successfully");

        props.onKeyUpdated?.();
      },
    });
  });

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex flex-col gap-8">
          <ProjectNameSetting
            form={form}
            handleSubmit={handleSubmit}
            isUpdatingProject={updateProject.isPending}
          />
          <ProjectImageSetting
            avatar={project.image || null}
            client={props.client}
            updateProjectImage={props.updateProjectImage}
          />
          <ProjectKeyDetails
            project={project}
            rotateSecretKey={props.rotateSecretKey}
          />
          <ProjectIdCard project={project} />
          <AllowedDomainsSetting
            form={form}
            handleSubmit={handleSubmit}
            isUpdatingProject={updateProject.isPending}
          />
          <AllowedBundleIDsSetting
            form={form}
            handleSubmit={handleSubmit}
            isUpdatingProject={updateProject.isPending}
          />
          <EnabledServicesSetting
            form={form}
            handleSubmit={handleSubmit}
            isUpdatingProject={updateProject.isPending}
            paths={paths}
            showNebulaSettings={props.showNebulaSettings}
          />
          <TransferProject
            client={props.client}
            currentTeamId={project.teamId}
            isOwnerAccount={props.isOwnerAccount}
            projectName={project.name}
            teamsWithRole={props.teamsWithRole}
            transferProject={props.transferProject}
          />
          <DeleteProject
            deleteProject={props.deleteProject}
            onDeleteSuccessful={() => {
              router.replace(paths.afterDeleteRedirectTo);
            }}
            projectName={project.name}
          />
        </div>
      </form>
    </Form>
  );
}

function ProjectNameSetting(props: {
  form: UpdateAPIForm;
  isUpdatingProject: boolean;
  handleSubmit: () => void;
}) {
  const { form, handleSubmit } = props;

  return (
    <SettingsCard
      bottomText="Please use 64 characters at maximum"
      errorText={form.getFieldState("name").error?.message}
      header={{
        description:
          "Assign a name to identify your project on thirdweb dashboard",
        title: "Project Name",
      }}
      noPermissionText={undefined}
      saveButton={{
        disabled: false,
        isPending: props.isUpdatingProject,
        onClick: handleSubmit,
      }}
    >
      <Input
        autoFocus
        placeholder="My Project"
        type="text"
        {...form.register("name")}
        className="max-w-[350px] bg-background"
      />
    </SettingsCard>
  );
}

function ProjectIdCard(props: { project: Project }) {
  return (
    <SettingsCard
      bottomText="Used when interacting with the thirdweb API"
      errorText={undefined}
      header={{
        description: "This is your project's ID on thirdweb",
        title: "Project ID",
      }}
      noPermissionText={undefined}
    >
      <CopyTextButton
        className="w-full justify-between truncate bg-background px-3 py-2 font-mono text-muted-foreground lg:w-[450px]"
        copyIconPosition="right"
        textToCopy={props.project.id}
        textToShow={props.project.id}
        tooltip="Copy Project ID"
        variant="outline"
      />
    </SettingsCard>
  );
}

function ProjectImageSetting(props: {
  updateProjectImage: (file: File | undefined) => Promise<void>;
  avatar: string | null;
  client: ThirdwebClient;
}) {
  const projectAvatarUrl = resolveSchemeWithErrorHandler({
    client: props.client,
    uri: props.avatar || undefined,
  });

  const [projectAvatar, setProjectAvatar] = useState<File | undefined>();

  const updateProjectAvatarMutation = useMutation({
    mutationFn: async (_avatar: File | undefined) => {
      await props.updateProjectImage(_avatar);
    },
  });

  function handleSave() {
    const promise = updateProjectAvatarMutation.mutateAsync(projectAvatar);
    toast.promise(promise, {
      error: "Failed to update project avatar",
      success: "Project avatar updated successfully",
    });
  }

  return (
    <SettingsCard
      bottomText="An avatar is optional but strongly recommended."
      errorText={undefined}
      noPermissionText={undefined}
      saveButton={{
        disabled: false,
        isPending: updateProjectAvatarMutation.isPending,
        onClick: handleSave,
      }}
    >
      <div className="flex flex-row gap-4 md:justify-between">
        <div>
          <h3 className="font-semibold text-xl tracking-tight">
            Project Avatar
          </h3>
          <p className="mt-1.5 mb-4 text-foreground text-sm leading-relaxed">
            This is your project's avatar. <br /> Click on the avatar to upload
            a custom one
          </p>
        </div>
        <FileInput
          accept={{ "image/*": [] }}
          className="w-20 rounded-full lg:w-28"
          client={props.client}
          disableHelperText
          setValue={setProjectAvatar}
          value={projectAvatar || projectAvatarUrl}
        />
      </div>
    </SettingsCard>
  );
}

function AllowedDomainsSetting(props: {
  form: UpdateAPIForm;
  isUpdatingProject: boolean;
  handleSubmit: () => void;
}) {
  const { form, handleSubmit } = props;

  const helperText = (
    <ul className="flex list-disc flex-col gap-1.5 py-1 pl-3 text-muted-foreground text-sm [&>li]:pl-1">
      <li>
        Authorize all domains with{" "}
        <span className="inline-block rounded bg-muted px-2 font-mono text-xs">
          *
        </span>
        {". "}
        <span>
          Example:{" "}
          <span className="inline-block rounded bg-muted px-2 font-mono text-xs">
            *.thirdweb.com
          </span>{" "}
          accepts all
          <span className="inline-block rounded bg-muted px-2 font-mono text-xs">
            .thirdweb.com
          </span>{" "}
          sites
        </span>
      </li>
      <li>
        Authorize localhost URLs with{" "}
        <span className="inline-block rounded bg-muted px-2 font-mono text-xs">
          {"localhost:<port>"}
        </span>
      </li>
      <li>Enter domains separated by commas or new lines</li>
    </ul>
  );

  return (
    <SettingsCard
      bottomText="This is only applicable for web applications"
      errorText={form.getFieldState("domains", form.formState).error?.message}
      header={{
        description:
          "Only allow Client ID to be used on specific domains to prevent unauthorized use",
        title: "Domain Restrictions",
      }}
      noPermissionText={undefined}
      saveButton={{
        disabled: false,
        isPending: props.isUpdatingProject,
        onClick: handleSubmit,
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="relative">
          <Label className="mb-2 inline-block" htmlFor="domains">
            Allowed Domains
          </Label>

          <CheckboxWithLabel className="absolute top-0 right-0">
            <Checkbox
              checked={form.watch("domains") === "*"}
              onCheckedChange={(v) => {
                form.setValue("domains", v ? "*" : "", {
                  shouldDirty: true,
                });
              }}
            />
            All Domains
          </CheckboxWithLabel>

          <Textarea
            placeholder="thirdweb.com, rpc.example.com, localhost:3000"
            {...form.register("domains")}
          />
        </div>

        {helperText}

        {!form.watch("domains") && (
          <Alert variant="warning">
            <AlertTitle className="text-sm">No Domains Configured</AlertTitle>
            <AlertDescription>
              This will deny requests from all origins, rendering the key
              unusable in frontend applications. <br /> Proceed only if you
              intend to use this key in server or native apps environments
            </AlertDescription>
          </Alert>
        )}

        {form.watch("domains") === "*" && (
          <Alert variant="warning">
            <AlertTitle className="text-sm">Unrestricted Web Access</AlertTitle>
            <AlertDescription>
              Requests from all origins will be authorized. Your key can be
              misused by other websites
            </AlertDescription>
          </Alert>
        )}
      </div>
    </SettingsCard>
  );
}

function AllowedBundleIDsSetting(props: {
  form: UpdateAPIForm;
  isUpdatingProject: boolean;
  handleSubmit: () => void;
}) {
  const { form, handleSubmit } = props;
  return (
    <SettingsCard
      bottomText="This is only applicable for Native games or Native applications"
      errorText={form.getFieldState("bundleIds", form.formState).error?.message}
      header={{
        description:
          "Only allow Client ID to be used on specific Bundle IDs to prevent unauthorized use",
        title: "Bundle ID Restrictions",
      }}
      noPermissionText={undefined}
      saveButton={{
        disabled: false,
        isPending: props.isUpdatingProject,
        onClick: handleSubmit,
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="relative ">
          <CheckboxWithLabel className="absolute top-0 right-0">
            <Checkbox
              checked={form.watch("bundleIds") === "*"}
              onCheckedChange={(checked) => {
                form.setValue("bundleIds", checked ? "*" : "", {
                  shouldDirty: true,
                });
              }}
            />
            All Bundle IDs
          </CheckboxWithLabel>

          <Label className="mb-2 inline-block">Allowed Bundle IDs</Label>

          <Textarea
            placeholder="com.thirdweb.app"
            {...form.register("bundleIds")}
          />
        </div>

        <p className="text-muted-foreground text-sm ">
          Enter bundle ids separated by commas or new lines.
        </p>

        {!form.watch("bundleIds") && (
          <Alert variant="warning">
            <AlertTitle className="text-sm">
              No Bundle IDs Configured
            </AlertTitle>
            <AlertDescription>
              This will deny requests from all native applications, rendering
              the key unusable. Proceed only if you intend to use this key in
              server or frontend environments.
            </AlertDescription>
          </Alert>
        )}
        {form.watch("bundleIds") === "*" && (
          <Alert variant="warning">
            <AlertTitle className="text-sm">Unrestricted App Access</AlertTitle>
            <AlertDescription>
              Requests from all applications will be authorized. If your key is
              leaked it could be misused.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </SettingsCard>
  );
}

function EnabledServicesSetting(props: {
  form: UpdateAPIForm;
  isUpdatingProject: boolean;
  handleSubmit: () => void;
  paths: ProjectSettingPaths;
  showNebulaSettings: boolean;
}) {
  const { form, handleSubmit } = props;

  const formFields = useFieldArray({
    control: form.control,
    name: "servicesMeta",
  });

  const toggleServiceAction = (
    srvIdx: number,
    srv: FieldArrayWithId<ProjectSettingsPageFormSchema, "servicesMeta", "id">,
    actionName: string,
    checked: boolean,
  ) => {
    const actions = checked
      ? [...(srv.actions || []), actionName]
      : (srv.actions || []).filter((a) => a !== actionName);

    formFields.update(srvIdx, {
      ...srv,
      actions,
    });
  };

  return (
    <SettingsCard
      bottomText=""
      errorText={undefined}
      header={{
        description: "thirdweb services enabled for this project",
        title: "Enabled Services",
      }}
      noPermissionText={undefined}
      saveButton={{
        disabled: false,
        isPending: props.isUpdatingProject,
        onClick: handleSubmit,
      }}
    >
      <DynamicHeight>
        <div className="flex flex-col">
          {formFields.fields.map((service, idx) => {
            const serviceDefinition = getServiceByName(
              service.name as ServiceName,
            );

            const hidden =
              (serviceDefinition.name === "nebula" &&
                !props.showNebulaSettings) ||
              HIDDEN_SERVICES.includes(serviceDefinition.name);

            const serviceName = getServiceByName(
              serviceDefinition.name as ServiceName,
            );
            const shouldShow = !hidden && serviceName;

            if (!shouldShow) {
              return null;
            }

            let configurationLink: string | undefined;
            if (
              serviceDefinition.name === "embeddedWallets" &&
              service.enabled
            ) {
              configurationLink = props.paths.inAppConfig;
            } else if (
              serviceDefinition.name === "bundler" &&
              service.enabled
            ) {
              configurationLink = props.paths.aaConfig;
            } else if (serviceDefinition.name === "pay" && service.enabled) {
              configurationLink = props.paths.payConfig;
            }

            return (
              <div
                className="flex items-start justify-between gap-6 border-border border-t py-5"
                key={service.name}
              >
                {/* Left */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="font-semibold text-base">
                      {serviceDefinition.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {serviceDefinition.description}
                    </p>
                  </div>

                  {configurationLink && (
                    <div>
                      <Button
                        asChild
                        className="min-w-32 justify-between gap-2"
                        size="sm"
                        variant="outline"
                      >
                        <Link href={configurationLink}>
                          Configure
                          <ExternalLinkIcon className="size-3 text-muted-foreground" />
                        </Link>
                      </Button>
                    </div>
                  )}

                  {serviceDefinition.actions.length > 0 && (
                    <div className="flex gap-4">
                      {serviceDefinition.actions.map((sa) => {
                        return (
                          <ToolTipLabel key={sa.name} label={sa.description}>
                            <div>
                              <CheckboxWithLabel>
                                <Checkbox
                                  checked={service.actions.includes(sa.name)}
                                  onCheckedChange={(checked) =>
                                    toggleServiceAction(
                                      idx,
                                      service,
                                      sa.name,
                                      !!checked,
                                    )
                                  }
                                />
                                {sa.title}
                              </CheckboxWithLabel>
                            </div>
                          </ToolTipLabel>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right */}
                <Switch
                  checked={service.enabled}
                  onCheckedChange={(v) => {
                    return formFields.update(idx, {
                      ...service,
                      enabled: !!v,
                    });
                  }}
                />
              </div>
            );
          })}
        </div>
      </DynamicHeight>
    </SettingsCard>
  );
}

function ProjectKeyDetails({
  project,
  rotateSecretKey,
}: {
  rotateSecretKey: RotateSecretKey;
  project: Project;
}) {
  // currently only showing the first secret key
  const { createdAt, updatedAt, lastAccessedAt } = project;
  const [secretKeyMasked, setSecretKeyMasked] = useState(
    project.secretKeys[0]?.masked,
  );
  const clientId = project.publishableKey;

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border bg-card px-4 py-6 lg:px-6">
      <div>
        <h3>Client ID</h3>
        <p className="mb-2 text-muted-foreground text-sm">
          Identifies your application.
        </p>

        <CopyTextButton
          className="!h-auto w-full max-w-[350px] justify-between truncate bg-background px-3 py-3 font-mono"
          copyIconPosition="right"
          textToCopy={clientId}
          textToShow={clientId}
          tooltip="Copy Client ID"
        />
      </div>

      {/* NOTE: for very old api keys the secret might be `null`, if that's the case we skip it */}
      {secretKeyMasked && (
        <div>
          <h3>Secret Key</h3>
          <p className="mb-2 text-muted-foreground text-sm">
            Identifies and authenticates your application from a backend. <br />{" "}
            This is not the full secret key, Refer to your saved secret key at
            the time of creation for the full secret key.
          </p>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm lg:w-[350px]">
              {secretKeyMasked}
            </div>

            <RotateSecretKeyButton
              onSuccess={(data) => {
                setSecretKeyMasked(data.data.secretMasked);
              }}
              rotateSecretKey={rotateSecretKey}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <TimeInfo date={createdAt} fallbackText="" label="Created" />
        <TimeInfo
          date={updatedAt}
          fallbackText="Not updated"
          label="Last Updated"
        />
        <TimeInfo
          date={lastAccessedAt}
          fallbackText="Not accessed in 30 days"
          label="Last Accessed"
        />
      </div>
    </div>
  );
}

function TimeInfo(props: {
  label: string;
  date: string | null;
  fallbackText: string;
}) {
  return (
    <div>
      <p> {props.label}</p>
      <p className="text-muted-foreground text-sm">
        {props.date
          ? format(new Date(props.date), "MMMM dd, yyyy")
          : props.fallbackText}
      </p>
    </div>
  );
}

function DeleteProject(props: {
  projectName: string;
  deleteProject: DeleteProject;
  onDeleteSuccessful: () => void;
}) {
  const deleteProject = useMutation({
    mutationFn: props.deleteProject,
  });

  const handleRevoke = () => {
    deleteProject.mutate(undefined, {
      onError: (err) => {
        toast.error("Failed to delete project");
        console.error(err);
      },
      onSuccess: () => {
        toast.success("Project deleted successfully");
        props.onDeleteSuccessful();
      },
    });
  };

  const description =
    "The associated Client ID and Secret Key will not able to access thirdweb services after deletion. This action is irreversible";

  return (
    <DangerSettingCard
      buttonLabel="Delete project"
      buttonOnClick={() => handleRevoke()}
      confirmationDialog={{
        description: description,
        title: `Delete project "${props.projectName}"?`,
      }}
      description={description}
      isPending={deleteProject.isPending}
      title="Delete Project"
    />
  );
}

export function RotateSecretKeyButton(props: {
  rotateSecretKey: RotateSecretKey;
  onSuccess: (data: RotateSecretKeyAPIReturnType) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalCloseAllowed, setIsModalCloseAllowed] = useState(true);
  return (
    <Dialog
      onOpenChange={(v) => {
        if (!isModalCloseAllowed) {
          return;
        }
        setIsOpen(v);
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button
          className="h-auto gap-2 rounded-lg bg-background px-4 py-3"
          onClick={() => setIsOpen(true)}
          variant="outline"
        >
          <RefreshCcwIcon className="size-4" />
          Rotate Secret Key
        </Button>
      </DialogTrigger>

      <DialogContent
        className="overflow-hidden p-0"
        dialogCloseClassName={cn(!isModalCloseAllowed && "hidden")}
      >
        <RotateSecretKeyModalContent
          closeModal={() => {
            setIsOpen(false);
            setIsModalCloseAllowed(true);
          }}
          disableModalClose={() => setIsModalCloseAllowed(false)}
          onSuccess={props.onSuccess}
          rotateSecretKey={props.rotateSecretKey}
        />
      </DialogContent>
    </Dialog>
  );
}

type RotateSecretKeyScreen =
  | { id: "initial" }
  | { id: "save-newkey"; secretKey: string };

function RotateSecretKeyModalContent(props: {
  rotateSecretKey: RotateSecretKey;
  closeModal: () => void;
  disableModalClose: () => void;
  onSuccess: (data: RotateSecretKeyAPIReturnType) => void;
}) {
  const [screen, setScreen] = useState<RotateSecretKeyScreen>({
    id: "initial",
  });

  if (screen.id === "save-newkey") {
    return (
      <SaveNewKeyScreen
        closeModal={props.closeModal}
        secretKey={screen.secretKey}
      />
    );
  }

  if (screen.id === "initial") {
    return (
      <RotateSecretKeyInitialScreen
        closeModal={props.closeModal}
        onSuccess={(data) => {
          props.disableModalClose();
          props.onSuccess(data);
          setScreen({ id: "save-newkey", secretKey: data.data.secret });
        }}
        rotateSecretKey={props.rotateSecretKey}
      />
    );
  }

  return null;
}

function RotateSecretKeyInitialScreen(props: {
  rotateSecretKey: RotateSecretKey;
  onSuccess: (data: RotateSecretKeyAPIReturnType) => void;
  closeModal: () => void;
}) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const rotateKeyMutation = useMutation({
    mutationFn: props.rotateSecretKey,
    onError: (err) => {
      console.error(err);
      toast.error("Failed to rotate secret key");
    },
    onSuccess: (data) => {
      props.onSuccess(data);
    },
  });
  return (
    <div>
      <div className="flex flex-col p-6">
        <DialogHeader>
          <DialogTitle>Rotate Secret Key</DialogTitle>
        </DialogHeader>

        <div className="h-6" />

        <Alert variant="destructive">
          <CircleAlertIcon className="size-5" />
          <AlertTitle>Current secret key will stop working</AlertTitle>
          <AlertDescription>
            Rotating the secret key will invalidate the current secret key and
            generate a new one. This action is irreversible.
          </AlertDescription>
        </Alert>

        <div className="h-4" />

        <CheckboxWithLabel className="text-foreground">
          <Checkbox
            checked={isConfirmed}
            onCheckedChange={(v) => setIsConfirmed(!!v)}
          />
          I understand the consequences of rotating the secret key
        </CheckboxWithLabel>
      </div>

      <div className="flex justify-end gap-3 border-t bg-card p-6">
        <Button onClick={props.closeModal} variant="outline">
          Close
        </Button>
        <Button
          className="gap-2"
          disabled={!isConfirmed || rotateKeyMutation.isPending}
          onClick={() => {
            rotateKeyMutation.mutate();
          }}
          variant="destructive"
        >
          {rotateKeyMutation.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <RefreshCcwIcon className="size-4" />
          )}
          Rotate Secret Key
        </Button>
      </div>
    </div>
  );
}

function SaveNewKeyScreen(props: {
  secretKey: string;
  closeModal: () => void;
}) {
  const [isSecretStored, setIsSecretStored] = useState(false);
  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex flex-col p-6">
        <DialogHeader>
          <DialogTitle>Save New Secret Key</DialogTitle>
        </DialogHeader>

        <div className="h-6" />

        <CopyTextButton
          className="!h-auto w-full justify-between bg-card px-3 py-3 font-mono"
          copyIconPosition="right"
          textToCopy={props.secretKey}
          textToShow={props.secretKey}
          tooltip="Copy Secret Key"
        />
        <div className="h-4" />

        <Alert variant="destructive">
          <AlertTitle>Do not share or expose your secret key</AlertTitle>
          <AlertDescription>
            <div className="mb-5">
              Secret keys cannot be recovered. If you lose your secret key, you
              will need to rotate the secret key or create a new Project.
            </div>
            <CheckboxWithLabel className="text-foreground">
              <Checkbox
                checked={isSecretStored}
                onCheckedChange={(v) => {
                  setIsSecretStored(!!v);
                }}
              />
              I confirm that I've securely stored my secret key
            </CheckboxWithLabel>
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex justify-end gap-3 border-t bg-card p-6">
        <Button
          className="gap-2"
          disabled={!isSecretStored}
          onClick={props.closeModal}
          variant="outline"
        >
          Close
        </Button>
      </div>
    </div>
  );
}

function TransferProject(props: {
  projectName: string;
  teamsWithRole: { role: "MEMBER" | "OWNER"; team: Team }[];
  currentTeamId: string;
  transferProject: (newTeam: Team) => Promise<void>;
  client: ThirdwebClient;
  isOwnerAccount: boolean;
}) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const transferProject = useMutation({
    mutationFn: props.transferProject,
  });

  const selectedTeamWithRole = props.teamsWithRole.find(
    ({ team }) => team.id === selectedTeamId,
  );
  const hasOwnerRole = selectedTeamWithRole?.role === "OWNER";

  const isDisabled =
    !selectedTeamWithRole ||
    !hasOwnerRole ||
    selectedTeamId === props.currentTeamId ||
    !props.isOwnerAccount;

  const handleTransfer = () => {
    if (!hasOwnerRole) {
      return;
    }

    const promise = transferProject.mutateAsync(selectedTeamWithRole.team);
    toast.promise(promise, {
      error: "Failed to transfer project",
      success: "Project transferred successfully",
    });
  };

  return (
    <DangerSettingCard
      buttonLabel="Transfer project"
      buttonOnClick={handleTransfer}
      confirmationDialog={{
        description: (
          <>
            <span className="mb-5 block">
              Are you sure you want to transfer this project to{" "}
              <span className="font-semibold">
                {selectedTeamWithRole?.team.name}
              </span>{" "}
              team?
            </span>

            <span className="mb-3 flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-warning-text">
              <TriangleAlertIcon className="size-5 shrink-0" />
              Current team will lose access to this project and all associated
              resources
            </span>

            <span className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-warning-text">
              <TriangleAlertIcon className="size-5 shrink-0" />
              Selected team will take over ownership and billing responsibility
              for this project and all associated resources
            </span>
          </>
        ),
        title: "Transfer project",
      }}
      description={<>Transfer this project to another team</>}
      isDisabled={isDisabled}
      isPending={transferProject.isPending}
      title="Transfer Project"
    >
      <div className="flex flex-col gap-4">
        <div>
          <Select
            disabled={transferProject.isPending || !props.isOwnerAccount}
            onValueChange={setSelectedTeamId}
            value={selectedTeamId}
          >
            <SelectTrigger className="w-auto min-w-[320px]">
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {props.teamsWithRole
                // .filter(({ team }) => team.id !== props.currentTeamId)
                .map(({ team }) => (
                  <SelectItem key={team.id} value={team.id}>
                    <div className="flex items-center gap-2 py-1">
                      <GradientAvatar
                        className="size-5"
                        client={props.client}
                        id={team.id}
                        src={team.image || ""}
                      />
                      {team.name}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {!props.isOwnerAccount && (
          <p className="text-muted-foreground text-sm">
            You do not have permission to transfer this project, You are not an
            owner of the current team
          </p>
        )}

        {selectedTeamId === props.currentTeamId && (
          <p className="text-muted-foreground text-sm">
            Project is already in the selected team
          </p>
        )}

        {selectedTeamId && !hasOwnerRole && (
          <p className="text-muted-foreground text-sm">
            You do not have permission to transfer this project, You are not an
            owner of the selected team
          </p>
        )}
      </div>
    </DangerSettingCard>
  );
}
