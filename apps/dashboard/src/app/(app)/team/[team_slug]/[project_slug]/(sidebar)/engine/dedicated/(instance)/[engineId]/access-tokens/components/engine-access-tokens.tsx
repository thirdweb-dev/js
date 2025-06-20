"use client";

import {
  useEngineAccessTokens,
  useEngineKeypairs,
  useHasEngineFeature,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { ButtonGroup, Flex } from "@chakra-ui/react";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { Button, Heading, Link, Text } from "tw-components";
import { CodeClient } from "@/components/ui/code/code.client";
import { InlineCode } from "@/components/ui/inline-code";
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
    <Flex flexDir="column" gap={4}>
      <Flex flexDir="column" gap={2}>
        <Heading size="title.md">Access Tokens</Heading>
      </Flex>

      {supportsKeyPairAuth && (
        <ButtonGroup size="sm" spacing={2} variant="ghost">
          <Button
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            isActive={selected === "standard"}
            onClick={() => setSelected("standard")}
            rounded="lg"
            type="button"
          >
            Standard
          </Button>
          <Button
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            isActive={selected === "keypair"}
            onClick={() => setSelected("keypair")}
            rounded="lg"
            type="button"
          >
            Keypair Authentication
          </Button>
        </ButtonGroup>
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
    </Flex>
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
    <>
      <Text>
        Access tokens allow API access to Engine.{" "}
        <Link
          color="primary.500"
          href="https://portal.thirdweb.com/engine/features/access-tokens"
          isExternal
        >
          Learn more about access tokens
        </Link>
        .
      </Text>

      <AccessTokensTable
        accessTokens={accessTokens.data ?? []}
        authToken={authToken}
        client={client}
        instanceUrl={instanceUrl}
        isFetched={accessTokens.isFetched}
        isPending={accessTokens.isPending}
      />
      <AddAccessTokenButton authToken={authToken} instanceUrl={instanceUrl} />

      <Flex direction="column" gap={2} mt={16}>
        <Heading size="title.md">Authenticate with your access token</Heading>
        <Text>
          Set the <InlineCode code="authorization" /> header.
        </Text>
        <CodeClient
          code={`const resp = fetch("<engine_url>/backend-wallet/get-all", {
  headers: {
    authorization: "Bearer <access_token>",
  },
});`}
          lang="ts"
        />
      </Flex>
    </>
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
      <Text>
        Keypair authentication allows your app to generate short-lived access
        tokens.
        <br />
        They are securely signed by your backend and verified with a public key.{" "}
        <Link
          color="primary.500"
          href="https://portal.thirdweb.com/engine/features/keypair-authentication"
          isExternal
        >
          Learn more about keypair authentication
        </Link>
        .
      </Text>

      <KeypairsTable
        authToken={authToken}
        instanceUrl={instanceUrl}
        isFetched={keypairs.isFetched}
        isPending={keypairs.isPending}
        keypairs={keypairs.data || []}
      />
      <AddKeypairButton authToken={authToken} instanceUrl={instanceUrl} />

      <Flex direction="column" gap={2} mt={16}>
        <Heading size="title.md">Authenticate with your access token</Heading>

        <Text>
          Set the <InlineCode code="authorization" /> header.
        </Text>
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
      </Flex>
    </>
  );
};
