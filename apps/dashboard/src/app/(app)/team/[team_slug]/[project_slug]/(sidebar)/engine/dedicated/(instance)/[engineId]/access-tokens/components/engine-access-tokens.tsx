"use client";

import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { CodeClient } from "@/components/ui/code/code.client";
import { InlineCode } from "@/components/ui/inline-code";
import { TabButtons } from "@/components/ui/tabs";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import {
  useEngineAccessTokens,
  useEngineKeypairs,
  useHasEngineFeature,
} from "@/hooks/useEngine";
import { AccessTokensTable } from "./access-tokens-table";
import { AddAccessTokenButton } from "./add-access-token-button";
import { AddKeypairButton } from "./add-keypair-button";
import { KeypairsTable } from "./keypairs-table";

interface EngineAccessTokensProps {
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}

type AccessTokenType = "standard" | "keypair";

export const EngineAccessTokens: React.FC<EngineAccessTokensProps> = ({
  instanceUrl,
  client,
  authToken,
}) => {
  const [selected, setSelected] = useState<AccessTokenType>("standard");
  const { isSupported: supportsKeyPairAuth } = useHasEngineFeature(
    instanceUrl,
    "KEYPAIR_AUTH",
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight mb-1">
        Access Tokens
      </h2>

      {supportsKeyPairAuth && (
        <TabButtons
          containerClassName="mb-4 mt-3"
          tabs={[
            {
              name: "Standard",
              onClick: () => setSelected("standard"),
              isActive: selected === "standard",
            },
            {
              name: "Keypair Authentication",
              onClick: () => setSelected("keypair"),
              isActive: selected === "keypair",
            },
          ]}
        />
      )}

      {selected === "standard" ? (
        <StandardAccessTokensPanel
          authToken={authToken}
          client={client}
          instanceUrl={instanceUrl}
        />
      ) : selected === "keypair" ? (
        <KeypairAuthenticationPanel
          authToken={authToken}
          instanceUrl={instanceUrl}
        />
      ) : null}
    </div>
  );
};

const StandardAccessTokensPanel = ({
  instanceUrl,
  authToken,
  client,
}: {
  instanceUrl: string;
  client: ThirdwebClient;
  authToken: string;
}) => {
  const accessTokens = useEngineAccessTokens({
    authToken,
    instanceUrl,
  });

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Access tokens allow API access to Engine.{" "}
        <UnderlineLink
          href="https://portal.thirdweb.com/engine/features/access-tokens"
          target="_blank"
        >
          Learn more about access tokens
        </UnderlineLink>
      </p>

      <AccessTokensTable
        accessTokens={accessTokens.data ?? []}
        authToken={authToken}
        client={client}
        instanceUrl={instanceUrl}
        isFetched={accessTokens.isFetched}
        isPending={accessTokens.isPending}
      />

      <div className="flex justify-end mt-4">
        <AddAccessTokenButton authToken={authToken} instanceUrl={instanceUrl} />
      </div>

      <div className="mt-16">
        <div className="mb-3">
          <h3 className="text-lg font-semibold mb-1">
            Authenticate with your access token
          </h3>
          <p className="text-sm text-muted-foreground">
            Set the <InlineCode code="authorization" /> header.
          </p>
        </div>
        <CodeClient
          code={`const resp = fetch("<engine_url>/backend-wallet/get-all", {
  headers: {
    authorization: "Bearer <access_token>",
  },
});`}
          lang="ts"
        />
      </div>
    </div>
  );
};

const KeypairAuthenticationPanel = ({
  instanceUrl,
  authToken,
}: {
  instanceUrl: string;
  authToken: string;
}) => {
  const keypairs = useEngineKeypairs({
    authToken,
    instanceUrl,
  });

  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">
        Keypair authentication allows your app to generate short-lived access
        tokens.
        <br />
        They are securely signed by your backend and verified with a public key.{" "}
        <UnderlineLink
          href="https://portal.thirdweb.com/engine/features/keypair-authentication"
          target="_blank"
        >
          Learn more about keypair authentication
        </UnderlineLink>
        .
      </p>

      <KeypairsTable
        authToken={authToken}
        instanceUrl={instanceUrl}
        isFetched={keypairs.isFetched}
        isPending={keypairs.isPending}
        keypairs={keypairs.data || []}
      />

      <div className="flex justify-end mt-4">
        <AddKeypairButton authToken={authToken} instanceUrl={instanceUrl} />
      </div>

      <div className="flex flex-col gap-2 mt-16">
        <h3 className="text-lg font-medium">
          Authenticate with your access token
        </h3>

        <p className="text-sm text-muted-foreground">
          Set the <InlineCode code="authorization" /> header.
        </p>
        <CodeClient
          code={`import jsonwebtoken from "jsonwebtoken";

// Generate an access token.
const payload = {
  iss: publicKey,
};
const accessToken = jsonwebtoken.sign(payload, privateKey, {
  algorithm: "ES256",   // The keypair algorithm
  expiresIn: "15s",     // Invalidate after 15 seconds
});

// Call Engine.
const resp = fetch("<engine_url>/backend-wallet/get-all", {
  headers: {
    authorization: \`Bearer \${restrictedAccessToken}\`,
  },
});`}
          lang="ts"
        />
      </div>
    </>
  );
};
