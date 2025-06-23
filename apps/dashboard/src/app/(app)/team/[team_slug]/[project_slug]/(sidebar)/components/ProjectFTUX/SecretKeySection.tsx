"use client";

import { useState } from "react";
import { rotateSecretKeyClient } from "@/hooks/useApi";
import { RotateSecretKeyButton } from "../../settings/ProjectGeneralSettingsPage";

export function SecretKeySection(props: {
  secretKeyMasked: string;
  teamId: string;
  projectId: string;
}) {
  const [secretKeyMasked, setSecretKeyMasked] = useState(props.secretKeyMasked);

  return (
    <div>
      <h3>Secret Key</h3>
      <p className="mb-2 text-muted-foreground text-sm">
        Identifies and authenticates your application from a backend. <br />{" "}
        This is not the full secret key, Refer to your saved secret key at the
        time of creation for the full secret key.
      </p>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm lg:w-[350px]">
          {secretKeyMasked}
        </div>

        <RotateSecretKeyButton
          onSuccess={(data) => {
            setSecretKeyMasked(data.data.secretMasked);
          }}
          rotateSecretKey={async () => {
            return rotateSecretKeyClient({
              projectId: props.projectId,
              teamId: props.teamId,
            });
          }}
        />
      </div>
    </div>
  );
}
