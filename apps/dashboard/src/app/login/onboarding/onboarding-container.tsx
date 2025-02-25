import { Spinner } from "@/components/ui/Spinner/Spinner";
import { cn } from "@/lib/utils";

export function OnboardingCard(props: {
  large?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative w-full rounded-xl border border-border bg-background p-6 shadow-lg",
        props.large ? "lg:max-w-[750px]" : "lg:w-[500px]",
      )}
    >
      {props.children}
    </div>
  );
}

export function ConnectEmbedSizedCard(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[522px] w-full items-center justify-center rounded-xl border border-border bg-card shadow-lg max-sm:max-w-[358px] lg:min-h-[568px] lg:w-[728px]">
      {props.children}
    </div>
  );
}

export function ConnectEmbedSizedLoadingCard() {
  return (
    <ConnectEmbedSizedCard>
      <Spinner className="size-10" />
    </ConnectEmbedSizedCard>
  );
}
