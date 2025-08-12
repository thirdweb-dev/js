import type { ThirdwebClient } from "thirdweb";
import type { Ecosystem } from "@/api/team/ecosystems";
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
          authToken={authToken}
          client={client}
          ecosystem={ecosystem}
          teamId={teamId}
        />
      ) : (
        <AuthOptionsFormSkeleton />
      )}
    </section>
  );
}
