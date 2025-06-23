import { useMutation } from "@tanstack/react-query";
import {
  BoxIcon,
  LogOutIcon,
  MailIcon,
  RocketIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { cn } from "@/lib/utils";

type OnboardingStep = {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  number: number;
};

const accountOnboardingSteps: OnboardingStep[] = [
  {
    description: "Provide email address",
    icon: UserIcon,
    number: 1,
    title: "Account Details",
  },
  {
    description: "Enter your verification code",
    icon: MailIcon,
    number: 2,
    title: "Verify Email",
  },
];

export function AccountOnboardingLayout(props: {
  children: React.ReactNode;
  currentStep: 1 | 2;
  logout: () => Promise<void>;
}) {
  const logout = useMutation({
    mutationFn: props.logout,
  });

  return (
    <OnboardingLayout
      cta={
        <Button
          className="gap-2 bg-card px-4"
          onClick={() => {
            logout.mutate();
          }}
          size="sm"
          variant="outline"
        >
          {logout.isPending ? (
            <Spinner className="size-3 text-muted-foreground" />
          ) : (
            <LogOutIcon className="size-3 text-muted-foreground" />
          )}
          Logout
        </Button>
      }
      currentStep={props.currentStep}
      steps={accountOnboardingSteps}
      title="Get started with thirdweb"
    >
      {props.children}
    </OnboardingLayout>
  );
}

const teamOnboardingSteps: OnboardingStep[] = [
  {
    description: "Provide team details",
    icon: BoxIcon,
    number: 1,
    title: "Team Details",
  },
  {
    description: "Choose a plan that fits your needs",
    icon: RocketIcon,
    number: 2,
    title: "Plan Selection",
  },
  {
    description: "Invite members to your team",
    icon: UsersIcon,
    number: 3,
    title: "Team Members",
  },
];

export function TeamOnboardingLayout(props: {
  children: React.ReactNode;
  currentStep: 1 | 2 | 3;
}) {
  return (
    <OnboardingLayout
      currentStep={props.currentStep}
      steps={teamOnboardingSteps}
      title="Setup your team"
    >
      {props.children}
    </OnboardingLayout>
  );
}

function OnboardingLayout(props: {
  steps: OnboardingStep[];
  currentStep: number;
  children: React.ReactNode;
  title: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="flex grow flex-col">
      <div className="border-border border-b py-10">
        <div className="container flex items-center justify-between gap-6">
          <h1 className="font-semibold text-2xl tracking-tight lg:text-3xl">
            {props.title}
          </h1>
          {props.cta}
        </div>
      </div>
      <div className="container flex grow flex-col gap-8 xl:flex-row xl:gap-10">
        {/* Left */}
        <div className="flex w-full flex-col py-8">{props.children}</div>

        {/* Right  */}
        <div className="hidden shrink-0 grow flex-col xl:flex">
          {/* Steps */}
          <div className="relative flex grow flex-col gap-7 pt-8">
            {/* Timeline line */}
            <div className="-translate-x-1/2 absolute top-0 bottom-0 left-5 border-border border-l border-dashed" />

            {props.steps.map((step) => {
              const isInactive = step.number !== props.currentStep;
              return (
                <div
                  className={cn("flex items-center gap-4")}
                  key={step.number}
                >
                  <div className="relative z-10 flex size-10 items-center justify-center rounded-full border bg-card">
                    <step.icon
                      className={cn(
                        "size-5 text-foreground",
                        isInactive && "opacity-50",
                      )}
                    />
                  </div>
                  <div
                    className={cn("flex flex-col", isInactive && "opacity-50")}
                  >
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
