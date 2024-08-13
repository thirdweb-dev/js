import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

export type DeployModalStep = {
  type: "deploy" | "setNFTMetadata" | "import";
  signatureCount: number;
};

export type DeployStatusModal = {
  open: (steps: DeployModalStep[]) => void;
  close: () => void;
  nextStep: () => void;
  isModalOpen: boolean;
  steps: DeployModalStep[];
  activeStep: number;
  setIsModalOpen: (isOpen: boolean) => void;
  viewContractLink: string | undefined;
  setViewContractLink: (link: string) => void;
};

export function useDeployStatusModal(): DeployStatusModal {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [steps, setSteps] = useState<DeployModalStep[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [viewContractLink, setViewContractLink] = useState<
    string | undefined
  >();

  const open = useCallback((steps_: DeployModalStep[]) => {
    setSteps(steps_);
    setIsModalOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsModalOpen(false);
    setSteps([]);
    setActiveStep(0);
  }, []);

  const nextStep = useCallback(() => {
    setActiveStep((currStep) => {
      return currStep + 1;
    });
  }, []);

  return {
    open,
    close,
    nextStep,
    isModalOpen,
    steps,
    activeStep,
    setIsModalOpen,
    viewContractLink,
    setViewContractLink,
  };
}

export function DeployStatusModal(props: {
  deployStatusModal: DeployStatusModal;
}) {
  const { steps, activeStep, isModalOpen, viewContractLink, setIsModalOpen } =
    props.deployStatusModal;

  // DO not close modal on outside click
  return (
    <Dialog open={isModalOpen}>
      <DialogContent
        dialogCloseClassName="hidden"
        className="max-w-[480px] p-0 gap-0"
      >
        <div className="p-6 flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              Deploy Status
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {steps.map((step, i) => {
              const isActive = i === activeStep;
              const hasCompleted = i < activeStep;
              return (
                <RenderDeployModalStep
                  key={step.type}
                  step={step}
                  isActive={isActive}
                  hasCompleted={hasCompleted}
                />
              );
            })}
          </div>
        </div>

        {viewContractLink && (
          <div className="flex justify-between mt-2 border-border border-t p-6 gap-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" asChild>
              <Link href={viewContractLink}>View Contract</Link>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

type DeployModalStepProps = {
  isActive: boolean;
  hasCompleted: boolean;
  step: DeployModalStep;
};

function RenderDeployModalStep(props: DeployModalStepProps) {
  const { isActive, hasCompleted } = props;
  const { title, description } = getStepInfo(props.step);
  return (
    <div className="rounded-lg border border-border">
      <div
        className={cn(
          "flex gap-4 p-4 items-center",
          !isActive && !hasCompleted && "opacity-30",
        )}
      >
        <div className="flex items-center justify-center shrink-0">
          {isActive ? (
            <Spinner className="size-6 text-link-foreground" />
          ) : hasCompleted ? (
            <CircleCheck className="size-6 text-green-500" />
          ) : (
            <CircleIcon className="size-6 text-secondary-foreground" />
          )}
        </div>

        <div className="flex flex-col">
          <h3 className="text-semibold mb-1 font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

type TitleAndDesc = {
  title: string;
  description: React.ReactNode;
};

function getStepInfo(step: DeployModalStep): TitleAndDesc {
  switch (step.type) {
    case "deploy": {
      return {
        title: "Deploying contract",
        description:
          step.signatureCount > 0
            ? `Your wallet will prompt you to sign ${
                step.signatureCount === 1 ? "the" : step.signatureCount || 1
              } transaction${step.signatureCount > 1 ? "s" : ""}.`
            : "This may take a few seconds",
      };
    }

    case "setNFTMetadata": {
      return {
        title: "Setting NFT metadata",
        description: (
          <>
            {step.signatureCount > 0
              ? "Your wallet will prompt you to sign the transaction. "
              : "This may take a few seconds."}
          </>
        ),
      };
    }

    case "import": {
      return {
        title: "Adding to dashboard",
        description: (
          <>
            {step.signatureCount > 0
              ? "Your wallet will prompt you to sign the transaction. "
              : ""}
            <i>
              This step is <b>gasless</b>.
            </i>
          </>
        ),
      };
    }
  }
}
