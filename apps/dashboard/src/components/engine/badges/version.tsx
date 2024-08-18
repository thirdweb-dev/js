import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import {
  type EngineInstance,
  useEngineLatestVersion,
  useEngineSystemHealth,
  useEngineUpdateVersion,
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

  const current = healthQuery.data?.engineVersion ?? "...";
  const latest = latestVersionQuery.data ?? "...";
  const isStale = current !== latest;

  if (!isStale) {
    return (
      <ToolTipLabel label="Latest Version">
        <Button variant="outline" asChild className="hover:bg-transparent">
          <div>{current}</div>
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
          {current}

          {/* Notification Dot */}
          <span className="absolute -top-1 -right-1">
            <PulseDot />
          </span>
        </Button>
      </ToolTipLabel>

      <UpdateVersionModal
        open={isModalOpen}
        onOpenChange={setModalOpen}
        latest={latest ?? ""}
        instance={instance}
      />
    </>
  );
};

const UpdateVersionModal = (props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  latest: string;
  instance: EngineInstance;
}) => {
  const { open, onOpenChange, latest, instance } = props;
  const updateEngine = useEngineUpdateVersion();

  if (!instance.cloudDeployedAt) {
    // For self-hosted, show a prompt to the Github release page.
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="z-[10001] max-w-[400px]"
          dialogOverlayClassName="z-[10000]"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight pr-4 mb-6">
              Update your self-hosted Engine to {latest}
            </DialogTitle>
            <DialogDescription>
              View the changelog in the{" "}
              <TrackedLinkTW
                href="https://github.com/thirdweb-dev/engine/releases"
                category="engine"
                label="clicked-engine-releases"
                target="_blank"
                className="text-link-foreground hover:text-foreground"
              >
                Engine Github repository
              </TrackedLinkTW>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const onClick = async () => {
    try {
      const promise = updateEngine.mutateAsync({ engineId: instance.id });
      toast.promise(promise, {
        success:
          "Submitted a request to update your Engine instance. Please allow 1-2 business days for this process.",
        error: "Unexpected error updating your Engine instance.",
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
          <DialogTitle>Update Engine to {latest}?</DialogTitle>
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
            {updateEngine.isLoading ? (
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
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
      <span className="relative inline-flex rounded-full size-2 bg-primary" />
    </span>
  );
}
