"use client";

import {
  useEngineAccessTokens,
  useEngineKeypairs,
  useEngineSystemHealth,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { ButtonGroup, Code, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { Button, CodeBlock, Heading, Link, Text } from "tw-components";
import { AccessTokensTable } from "./access-tokens-table";
import { AddAccessTokenButton } from "./add-access-token-button";
import { AddKeypairButton } from "./add-keypair-button";
import { KeypairsTable } from "./keypairs-table";

interface EngineAccessTokensProps {
  instanceUrl: string;
}

type AccessTokenType = "standard" | "keypair";

export const EngineAccessTokens: React.FC<EngineAccessTokensProps> = ({
  instanceUrl,
}) => {
  const [selected, setSelected] = useState<AccessTokenType>("standard");
  const health = useEngineSystemHealth(instanceUrl);

  const hasFeatureKeypairAuthentication =
    health.data?.features?.includes("KEYPAIR_AUTH");

  return (
    <Flex flexDir="column" gap={4}>
      <Flex flexDir="column" gap={2}>
        <Heading size="title.md">Access Tokens</Heading>
      </Flex>

      {hasFeatureKeypairAuthentication && (
        <ButtonGroup size="sm" variant="ghost" spacing={2}>
          <Button
            type="button"
            isActive={selected === "standard"}
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
            onClick={() => setSelected("standard")}
          >
            Standard
          </Button>
          <Button
            type="button"
            isActive={selected === "keypair"}
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
            onClick={() => setSelected("keypair")}
          >
            Keypair Authentication
          </Button>
        </ButtonGroup>
      )}

      {selected === "standard" ? (
        <StandardAccessTokensPanel instanceUrl={instanceUrl} />
      ) : selected === "keypair" ? (
        <KeypairAuthenticationPanel instanceUrl={instanceUrl} />
      ) : null}
    </Flex>
  );
};

const StandardAccessTokensPanel = ({
  instanceUrl,
}: {
  instanceUrl: string;
}) => {
  const accessTokens = useEngineAccessTokens(instanceUrl);

  return (
    <>
      <Text>
        Access tokens allow API access to Engine.{" "}
        <Link
          href="https://portal.thirdweb.com/engine/features/access-tokens"
          color="primary.500"
          isExternal
        >
          Learn more about access tokens
        </Link>
        .
      </Text>

      <AccessTokensTable
        instanceUrl={instanceUrl}
        accessTokens={accessTokens.data ?? []}
        isLoading={accessTokens.isLoading}
        isFetched={accessTokens.isFetched}
      />
      <AddAccessTokenButton instanceUrl={instanceUrl} />

      <Flex direction="column" gap={2} mt={16}>
        <Heading size="title.md">Authenticate with your access token</Heading>
        <Text>
          Set the <Code>authorization</Code> header.
        </Text>
        <CodeBlock
          language="typescript"
          code={`const resp = fetch("<engine_url>/backend-wallet/get-all", {
  headers: {
    authorization: "Bearer <access_token>",
  },
});`}
        />
      </Flex>
    </>
  );
};

const KeypairAuthenticationPanel = ({
  instanceUrl,
}: {
  instanceUrl: string;
}) => {
  const keypairs = useEngineKeypairs(instanceUrl);

  return (
    <>
      <Text>
        Keypair authentication allows your app to geneate short-lived access
        tokens.
        <br />
        They are securely signed by your backend and verified with a public key.{" "}
        <Link
          href="https://portal.thirdweb.com/engine/features/keypair-authentication"
          color="primary.500"
          isExternal
        >
          Learn more about keypair authentication
        </Link>
        .
      </Text>

      <KeypairsTable
        instanceUrl={instanceUrl}
        keypairs={keypairs.data || []}
        isLoading={keypairs.isLoading}
        isFetched={keypairs.isFetched}
      />
      <AddKeypairButton instanceUrl={instanceUrl} />

      <Flex direction="column" gap={2} mt={16}>
        <Heading size="title.md">Authenticate with your access token</Heading>

        <Text>
          Set the <Code>authorization</Code> header.
        </Text>
        <CodeBlock
          language="typescript"
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
        />
      </Flex>
    </>
  );
};
