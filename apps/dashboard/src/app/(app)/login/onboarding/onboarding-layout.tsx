import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import {
  BoxIcon,
  LogOutIcon,
  MailIcon,
  RocketIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

type OnboardingStep = {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  number: number;
};

const accountOnboardingSteps: OnboardingStep[] = [
  {
    icon: UserIcon,
    title: "Account Details",
    description: "Provide email address",
    number: 1,
  },
  {
    icon: MailIcon,
    title: "Verify Email",
    description: "Enter your verification code",
    number: 2,
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
      steps={accountOnboardingSteps}
      currentStep={props.currentStep}
      title="Get started with thirdweb"
      cta={
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-card px-4"
          onClick={() => {
            logout.mutate();
          }}
        >
          {logout.isPending ? (
            <Spinner className="size-3 text-muted-foreground" />
          ) : (
            <LogOutIcon className="size-3 text-muted-foreground" />
          )}
          Logout
        </Button>
      }
    >
      {props.children}
    </OnboardingLayout>
  );
}

const teamOnboardingSteps: OnboardingStep[] = [
  {
    icon: BoxIcon,
    title: "Team Details",
    description: "Provide team details",
    number: 1,
  },
  {
    icon: RocketIcon,
    title: "Plan Selection",
    description: "Choose a plan that fits your needs",
    number: 2,
  },
  {
    icon: UsersIcon,
    title: "Team Members",
    description: "Invite members to your team",
    number: 3,
  },
];

export function TeamOnboardingLayout(props: {
  children: React.ReactNode;
  currentStep: 1 | 2 | 3;
}) {
  return (
    <OnboardingLayout
      steps={teamOnboardingSteps}
      currentStep={props.currentStep}
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
                  key={step.number}
                  className={cn("flex items-center gap-4")}
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
