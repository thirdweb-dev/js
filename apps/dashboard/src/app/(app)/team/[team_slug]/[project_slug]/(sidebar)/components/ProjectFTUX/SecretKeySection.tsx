"use client";

import { useState } from "react";
import type { Project } from "@/api/project/projects";
import { rotateSecretKeyClient } from "@/hooks/useApi";
import { RotateSecretKeyButton } from "../../settings/ProjectGeneralSettingsPage";

export function SecretKeySection(props: {
  secretKeyMasked: string;
  project: Project;
}) {
  const [secretKeyMasked, setSecretKeyMasked] = useState(props.secretKeyMasked);

  return (
    <div>
      <h3 className="mb-1 text-base text-foreground font-medium">Secret Key</h3>
      <p className="mb-3 text-muted-foreground text-sm">
        Identifies and authenticates your application from a backend. <br />{" "}
        This is not the full secret key, Refer to your saved secret key at the
        time of creation for the full secret key.
      </p>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:w-[400px]">
        <div className="rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm grow">
          {secretKeyMasked}
        </div>

        <RotateSecretKeyButton
          onSuccess={(data) => {
            setSecretKeyMasked(data.data.secretMasked);
          }}
          rotateSecretKey={async () => {
            return rotateSecretKeyClient({
              project: props.project,
            });
          }}
        />
      </div>
    </div>
  );
}
