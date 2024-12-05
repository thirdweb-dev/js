import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { mobileViewport } from "../../../../../../stories/utils";
import { BlueprintPlaygroundUI } from "./blueprint-playground.client";
import type { BlueprintMetadata } from "./getBlueprintMetadata";

const meta = {
  title: "Insight/BlueprintPlayground",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    metadata: getBlueprintMetadata().transactionsMetadata,
  },
};

export const Mobile: Story = {
  args: {
    metadata: getBlueprintMetadata().transactionsMetadata,
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Story() {
  return (
    <div className="flex flex-col gap-10">
      <Variant metadata={getBlueprintMetadata().transactionsMetadata} />
      <Variant metadata={getBlueprintMetadata().eventsMetadata} />
      <Variant metadata={getBlueprintMetadata().tokensMetadata} />
      <Variant metadata={getBlueprintMetadata().largeNumberOfParamsMetadata} />
    </div>
  );
}

function Variant(props: {
  metadata: BlueprintMetadata;
}) {
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const controller = new AbortController();
      setAbortController(controller);
      const start = performance.now();
      const promise = new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 4000),
      );
      await Promise.race([
        promise,
        new Promise((_, reject) =>
          controller.signal.addEventListener("abort", reject),
        ),
      ]);

      const dummyResponse = {
        data: {
          title: "This is a dummy response",
          content: crypto.getRandomValues(new Uint8Array(100)),
        },
      };

      return {
        data: JSON.stringify(dummyResponse, null, 2),
        status: 200,
        time: performance.now() - start,
      };
    },
  });
  return (
    <div className="flex min-h-[800px] flex-col">
      <BlueprintPlaygroundUI
        metadata={props.metadata}
        backLink="/"
        isPending={mutation.isPending}
        onRun={async () => {
          mutation.mutateAsync();
        }}
        response={mutation.data}
        clientId="68665db28327c771c9a1bd5fc4580a0a"
        abortRequest={() => {
          abortController?.abort();
        }}
      />
    </div>
  );
}

function getBlueprintMetadata() {
  const transactionsMetadata: BlueprintMetadata = {
    domain: "https://{chainId}.insight.thirdweb.com",
    path: "/v1/{clientId}/transactions",
    parameters: [
      {
        name: "chainId",
        in: "path",
        required: true,
        description: "Chain ID",
        type: "string",
      },
      {
        name: "filter",
        in: "query",
        description: "Filter parameters",
        type: "string",
      },
      {
        name: "group_by",
        in: "query",
        description: "Field to group results by",
        type: "string",
      },
      {
        name: "sort_by",
        in: "query",
        description: "Field to sort results by",
        type: "string",
      },
      {
        name: "sort_order",
        in: "query",
        description: "Sort order (asc or desc)",
        type: "string",
      },
      {
        name: "page",
        in: "query",
        description: "Page number for pagination",
        type: "integer",
      },
      {
        name: "limit",
        in: "query",
        description: "Number of items per page",
        type: "integer",
      },
      {
        name: "aggregate",
        in: "query",
        description: "List of aggregate functions to apply",
        type: "array",
      },
    ],
    title: "Transactions",
    description: "Retrieve all transactions across all contracts",
  };

  const eventsMetadata: BlueprintMetadata = {
    domain: "https://{chainId}.insight.thirdweb.com",
    path: "/v1/{clientId}/events",
    parameters: [
      {
        name: "chainId",
        in: "path",
        required: true,
        description: "Chain ID",
        type: "string",
      },
      {
        name: "filter",
        in: "query",
        description: "Filter parameters",
        type: "string",
      },
      {
        name: "group_by",
        in: "query",
        description: "Field to group results by",
        type: "string",
      },
      {
        name: "sort_by",
        in: "query",
        description: "Field to sort results by",
        type: "string",
      },
      {
        name: "sort_order",
        in: "query",
        description: "Sort order (asc or desc)",
        type: "string",
      },
      {
        name: "page",
        in: "query",
        description: "Page number for pagination",
        type: "integer",
      },
      {
        name: "limit",
        in: "query",
        description: "Number of items per page",
        type: "integer",
      },
      {
        name: "aggregate",
        in: "query",
        description: "List of aggregate functions to apply",
        type: "array",
      },
    ],
    title: "Events",
    description: "Retrieve all logs across all contracts",
  };

  const tokensMetadata: BlueprintMetadata = {
    domain: "https://{chainId}.insight.thirdweb.com",
    path: "/v1/{clientId}/tokens/erc20/:ownerAddress",
    parameters: [
      {
        name: "ownerAddress",
        in: "path",
        required: true,
        type: "string",
      },
      {
        name: "clientId",
        in: "path",
        required: false,
        type: "string",
      },
    ],
    title: "Tokens",
    description: "Retrieve tokens balances for a given owner address",
  };

  const largeNumberOfParamsMetadata: BlueprintMetadata = {
    domain: "https://{chainId}.insight.thirdweb.com",
    path: "/v1/{clientId}/events",
    parameters: new Array(20).fill(null).map((_v, i) => {
      return {
        name: `param-name-${i}`,
        in: Math.random() > 0.5 ? "path" : "query",
        type: "string",
      };
    }),
    title: "Large Number of Params",
    description: "This blueprint has a large number of parameters",
  };

  return {
    transactionsMetadata,
    eventsMetadata,
    tokensMetadata,
    largeNumberOfParamsMetadata,
  };
}
