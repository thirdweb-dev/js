import type { Ecosystem } from "../../../../../types";
import {
  AuthOptionsForm,
  AuthOptionsFormSkeleton,
} from "../client/auth-options-form.client";

export function AuthOptionsSection({
  ecosystem,
  authToken,
}: { ecosystem?: Ecosystem; authToken: string }) {
  return (
    <section className="flex flex-col gap-4 md:gap-8">
      {ecosystem ? (
        <AuthOptionsForm ecosystem={ecosystem} authToken={authToken} />
      ) : (
        <AuthOptionsFormSkeleton />
      )}
    </section>
  );
}
