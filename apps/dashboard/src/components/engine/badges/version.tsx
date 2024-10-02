import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import {
  type EngineInstance,
  useEngineLatestVersion,
  useEngineSystemHealth,
  useEngineUpdateServerVersion,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { CircleArrowDownIcon, CloudDownloadIcon } from "lucide-react";
import { useState } from "react";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { toast } from "sonner";

export const EngineVersionBadge = ({
  instance,
}: {
  instance: EngineInstance;
}) => {
  const healthQuery = useEngineSystemHealth(instance.url);
  const latestVersionQuery = useEngineLatestVersion();
  const [isModalOpen, setModalOpen] = useState(false);

  const currentVersion = healthQuery.data?.engineVersion ?? "...";
  const latestVersion = latestVersionQuery.data;
  const isStale = latestVersion && currentVersion !== latestVersion;

  if (!isStale) {
    return (
      <ToolTipLabel label="Latest Version">
        <Button variant="outline" asChild className="hover:bg-transparent">
          <div>{currentVersion}</div>
        </Button>
      </ToolTipLabel>
    );
  }

  return (
    <>
      <ToolTipLabel
        label="New version is available"
        leftIcon={
          <CircleArrowDownIcon className="size-4 text-link-foreground" />
        }
      >
        <Button
          variant="outline"
          className="relative"
          onClick={() => setModalOpen(true)}
        >
          {currentVersion}

          {/* Notification Dot */}
          <span className="-top-1 -right-1 absolute">
            <PulseDot />
          </span>
        </Button>
      </ToolTipLabel>

      {latestVersion && (
        <UpdateVersionModal
          open={isModalOpen}
          onOpenChange={setModalOpen}
          latestVersion={latestVersion}
          instance={instance}
        />
      )}
    </>
  );
};

const UpdateVersionModal = (props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  latestVersion: string;
  instance: EngineInstance;
}) => {
  const { open, onOpenChange, latestVersion, instance } = props;
  const updateEngineServerMutation = useEngineUpdateServerVersion();

  if (!instance.deploymentId) {
    // For self-hosted, show a prompt to the Github release page.
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="z-[10001] max-w-[400px]"
          dialogOverlayClassName="z-[10000]"
        >
          <DialogHeader>
            <DialogTitle className="mb-6 pr-4 font-semibold text-2xl tracking-tight">
              Update your self-hosted Engine to {latestVersion}
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

  const onClick = async () => {
    try {
      const promise = updateEngineServerMutation.mutateAsync({
        engineId: instance.id,
        serverVersion: latestVersion,
      });
      toast.promise(promise, {
        success: `Upgrading your Engine to ${latestVersion}. Please confirm after a few minutes.`,
        error: "Unexpected error updating your Engine.",
      });
      await promise;
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="z-[10001] max-w-[400px]"
        dialogOverlayClassName="z-[10000]"
      >
        <DialogHeader>
          <DialogTitle>Update Engine to {latestVersion}?</DialogTitle>

          <DialogDescription>
            It is recommended to pause traffic to Engine before performing this
            upgrade. There is &lt; 1 minute of expected downtime.
          </DialogDescription>
        </DialogHeader>

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
            onClick={onClick}
            variant="primary"
            className="gap-2"
          >
            {updateEngineServerMutation.isPending ? (
              <Spinner className="size-4" />
            ) : (
              <CloudDownloadIcon className="size-4" />
            )}
            Update
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
