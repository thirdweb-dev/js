import { cn } from "@/lib/utils";
import { MailIcon, UserIcon } from "lucide-react";

export function OnboardingLayout(props: {
  children: React.ReactNode;
  currentStep: 1 | 2;
}) {
  const steps = [
    {
      icon: UserIcon,
      title: "Your details",
      description: "Provide email address",
      number: 1,
    },
    {
      icon: MailIcon,
      title: "Verify your email",
      description: "Enter your verification code",
      number: 2,
    },
  ];

  return (
    <div className="flex grow flex-col">
      <div className="border-border border-b py-10">
        <div className="container">
          <h1 className="font-semibold text-2xl tracking-tight lg:text-3xl">
            Get started with thirdweb
          </h1>
        </div>
      </div>
      <div className="container flex grow flex-col gap-8 xl:flex-row">
        {/* Left */}
        <div className="flex w-full max-w-[900px] flex-col py-8">
          {props.children}
        </div>

        {/* Right  */}
        <div className="hidden shrink-0 grow flex-col border-l border-dashed p-8 pl-6 lg:flex">
          {/* Steps */}
          <div className="flex flex-col gap-7">
            {steps.map((step) => (
              <div
                key={step.number}
                className={cn(
                  "flex items-center gap-4",
                  step.number !== props.currentStep && "opacity-50",
                )}
              >
                <div className="flex size-10 items-center justify-center rounded-full border">
                  <step.icon className="size-5 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
