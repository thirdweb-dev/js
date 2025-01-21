"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import {
  type EngineInstance,
  useEngineGetDeploymentPublicConfiguration,
  useEngineSystemHealth,
  useEngineUpdateDeployment,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { formatDistanceToNow } from "date-fns";
import { CircleArrowUpIcon, TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import invariant from "tiny-invariant";

export const EngineVersionBadge = ({
  instance,
  teamSlug,
}: {
  instance: EngineInstance;
  teamSlug: string;
}) => {
  const healthQuery = useEngineSystemHealth(instance.url);
  const publicConfigurationQuery = useEngineGetDeploymentPublicConfiguration({
    teamSlug,
  });
  const [isModalOpen, setModalOpen] = useState(false);

  if (!healthQuery.data || !publicConfigurationQuery.data) {
    return null;
  }

  const serverVersions = publicConfigurationQuery.data.serverVersions;
  const latestVersion = serverVersions[0];
  const currentVersion = healthQuery.data.engineVersion ?? "N/A";
  const hasNewerVersion = latestVersion?.name !== currentVersion;

  // Hide the change version modal unless owner.
  if (!instance.deploymentId) {
    return (
      <Button variant="outline" asChild className="hover:bg-transparent">
        <div>{currentVersion}</div>
      </Button>
    );
  }

  return (
    <>
      <ToolTipLabel
        label={
          hasNewerVersion
            ? "An update is available"
            : "Engine is on the latest update"
        }
        leftIcon={<CircleArrowUpIcon className="size-4 text-link-foreground" />}
      >
        <Button
          variant="outline"
          className="relative"
          onClick={() => setModalOpen(true)}
        >
          {currentVersion}

          {/* Notification dot if an update is available */}
          {hasNewerVersion && (
            <span className="-top-1 -right-1 absolute">
              <PulseDot />
            </span>
          )}
        </Button>
      </ToolTipLabel>

      <ChangeVersionModal
        open={isModalOpen}
        onOpenChange={setModalOpen}
        instance={instance}
        currentVersion={currentVersion}
        serverVersions={serverVersions}
        teamSlug={teamSlug}
      />
    </>
  );
};

const ChangeVersionModal = (props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instance: EngineInstance;
  currentVersion: string;
  serverVersions: { name: string; createdAt: string }[];
  teamSlug: string;
}) => {
  const {
    open,
    onOpenChange,
    instance,
    currentVersion,
    serverVersions,
    teamSlug,
  } = props;
  const [selectedVersion, setSelectedVersion] = useState(
    serverVersions[0]?.name,
  );
  const updateDeploymentMutation = useEngineUpdateDeployment();

  if (!instance.deploymentId) {
    // Self-hosted modal: prompt to update manually.
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="z-[10001] max-w-[400px]"
          dialogOverlayClassName="z-[10000]"
        >
          <DialogHeader>
            <DialogTitle className="mb-6 pr-4 font-semibold text-2xl tracking-tight">
              Update your self-hosted Engine
            </DialogTitle>
            <DialogDescription>
              View the{" "}
              <TrackedLinkTW
                href="https://github.com/thirdweb-dev/engine/releases"
                category="engine"
                label="clicked-engine-releases"
                target="_blank"
                className="text-link-foreground hover:text-foreground"
              >
                latest changelog
              </TrackedLinkTW>
              .
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const onClickUpdate = async () => {
    invariant(selectedVersion, "No version selected.");
    invariant(instance.deploymentId, "Engine is missing deploymentId.");

    try {
      const promise = updateDeploymentMutation.mutateAsync({
        teamSlug,
        deploymentId: instance.deploymentId,
        serverVersion: selectedVersion,
      });
      toast.promise(promise, {
        success: `Updating your Engine to ${selectedVersion}.`,
        error: "Unexpected error updating Engine.",
      });
      await promise;
    } finally {
      onOpenChange(false);
    }
  };

  // For cloud-hosted, prompt the user to select a version to update to.
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="z-[10001] max-w-[400px]"
        dialogOverlayClassName="z-[10000]"
      >
        <DialogHeader>
          <DialogTitle>Update Engine version</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <Select
            onValueChange={(value) => setSelectedVersion(value)}
            value={selectedVersion}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[10001]">
              <SelectGroup>
                {serverVersions.map(({ name, createdAt }, idx) => {
                  const isCurrentVersion = name === currentVersion;
                  const isLatestVersion = idx === 0;
                  return (
                    <SelectItem
                      key={name}
                      value={name}
                      id={name}
                      disabled={isCurrentVersion}
                    >
                      <span>{name}</span>
                      <span className="ml-4 text-muted-foreground">
                        {formatDistanceToNow(new Date(createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      {isCurrentVersion ? (
                        <Badge className="ml-2">current</Badge>
                      ) : isLatestVersion ? (
                        <Badge className="ml-2">latest</Badge>
                      ) : null}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="h-4" />

          {currentVersion.startsWith("v") && (
            <div>
              <TrackedLinkTW
                href={`https://github.com/thirdweb-dev/engine/compare/${currentVersion}...${selectedVersion}`}
                category="engine"
                label="clicked-engine-releases"
                target="_blank"
                className="text-link-foreground hover:text-foreground"
              >
                View changes: {currentVersion} &rarr; {selectedVersion}
              </TrackedLinkTW>
            </div>
          )}

          <div className="h-4" />

          <Alert variant="warning">
            <TriangleAlertIcon className="!text-warning-text size-4" />
            <AlertTitle>There may be up to 1 minute of downtime.</AlertTitle>

            <AlertDescription className="!pl-0 pt-2">
              We recommended pausing traffic to Engine before performing this
              version update.
            </AlertDescription>
          </Alert>
        </DialogDescription>

        <DialogFooter className="mt-5">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Close
          </Button>
          <Button
            type="submit"
            onClick={onClickUpdate}
            variant="primary"
            className="gap-2"
            disabled={selectedVersion === currentVersion}
          >
            {updateDeploymentMutation.isPending ? (
              <Spinner className="size-4" />
            ) : (
              <CircleArrowUpIcon className="size-4" />
            )}
            Update to {selectedVersion}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function PulseDot() {
  return (
    <span className="relative flex size-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-primary" />
    </span>
  );
}
