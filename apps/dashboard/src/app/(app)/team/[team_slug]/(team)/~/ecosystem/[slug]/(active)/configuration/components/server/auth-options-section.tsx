import type { ThirdwebClient } from "thirdweb";
import type { Ecosystem } from "../../../../../types";
import {
  AuthOptionsForm,
  AuthOptionsFormSkeleton,
} from "../client/auth-options-form.client";

export function AuthOptionsSection({
  ecosystem,
  authToken,
  teamId,
  client,
}: {
  ecosystem?: Ecosystem;
  authToken: string;
  teamId: string;
  client: ThirdwebClient;
}) {
  return (
    <section className="flex flex-col gap-4 md:gap-8">
      {ecosystem ? (
        <AuthOptionsForm
          ecosystem={ecosystem}
          authToken={authToken}
          teamId={teamId}
          client={client}
        />
      ) : (
        <AuthOptionsFormSkeleton />
      )}
    </section>
  );
}
