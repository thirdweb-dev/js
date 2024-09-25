import { Skeleton } from "@/components/ui/skeleton";
import type { Ecosystem } from "../../../../types";
import {
  AuthOptionsForm,
  AuthOptionsFormSkeleton,
} from "../client/auth-options-form.client";

export function AuthOptionsSection({ ecosystem }: { ecosystem?: Ecosystem }) {
  return (
    <section className="flex flex-col gap-4 md:gap-8">
      <div className="flex flex-col gap-1">
        <h4 className="font-semibold text-2xl text-foreground">
          Authentication Options
        </h4>
        {ecosystem ? (
          <p className="text-muted-foreground text-sm">
            Configure the authentication options your ecosystem supports.
          </p>
        ) : (
          <Skeleton className="h-6 w-[300px]" />
        )}
      </div>
      {ecosystem ? (
        <AuthOptionsForm ecosystem={ecosystem} />
      ) : (
        <AuthOptionsFormSkeleton />
      )}
    </section>
  );
}
