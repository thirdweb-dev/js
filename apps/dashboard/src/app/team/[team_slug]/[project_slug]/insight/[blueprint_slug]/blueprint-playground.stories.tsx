import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { mobileViewport } from "../../../../../../stories/utils";
import type { BlueprintPathMetadata } from "../utils";
import { BlueprintPlaygroundUI } from "./blueprint-playground.client";

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
    metadata: getBlueprintMetadata().test1,
  },
};

export const Mobile: Story = {
  args: {
    metadata: getBlueprintMetadata().test1,
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Story() {
  return (
    <div className="flex flex-col gap-10">
      <Variant
        metadata={getBlueprintMetadata().test1}
        isInsightEnabled={true}
      />

      <Variant
        metadata={getBlueprintMetadata().test1}
        isInsightEnabled={false}
      />
    </div>
  );
}

function Variant(props: {
  metadata: BlueprintPathMetadata;
  isInsightEnabled: boolean;
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
        domain="https://insight.thirdweb.com"
        path="/foo/bar"
        isInsightEnabled={props.isInsightEnabled}
        projectSettingsLink="/foo"
        supportedChainIds={[
          2039, 30, 98865, 42793, 1, 1952959480, 37714555429, 8008135, 55244,
          42019, 8453, 480, 84532, 7897,
        ]}
      />
    </div>
  );
}

function getBlueprintMetadata() {
  const test1: BlueprintPathMetadata = {
    description: "Get transactions",
    summary: "Get transactions",
    parameters: [
      {
        schema: {
          type: "number",
          description: "Filter by block number",
          example: 1000000,
        },
        required: false,
        name: "filter_block_number",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by block number greater than or equal to",
          example: 1000000,
        },
        required: false,
        name: "filter_block_number_gte",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by block number greater than",
          example: 1000000,
        },
        required: false,
        name: "filter_block_number_gt",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by block number less than or equal to",
          example: 1000000,
        },
        required: false,
        name: "filter_block_number_lte",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by block number less than",
          example: 1000000,
        },
        required: false,
        name: "filter_block_number_lt",
        in: "query",
      },
      {
        schema: {
          type: "string",
          description: "Filter by block hash",
          example:
            "0x3a1fba5abd9d41457944e91ed097e039b7b12d3d7ba324a3f422db2277a48e28",
        },
        required: false,
        name: "filter_block_hash",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by block timestamp",
          example: 1715222400,
        },
        required: false,
        name: "filter_block_timestamp",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by block timestamp greater than or equal to",
          example: 1715222400,
        },
        required: false,
        name: "filter_block_timestamp_gte",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by block timestamp greater than",
          example: 1715222400,
        },
        required: false,
        name: "filter_block_timestamp_gt",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by block timestamp less than or equal to",
          example: 1715222400,
        },
        required: false,
        name: "filter_block_timestamp_lte",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by block timestamp less than",
          example: 1715222400,
        },
        required: false,
        name: "filter_block_timestamp_lt",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by transaction index",
          example: 5,
        },
        required: false,
        name: "filter_transaction_index",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by transaction index greater than or equal to",
          example: 5,
        },
        required: false,
        name: "filter_transaction_index_gte",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by transaction index greater than",
          example: 5,
        },
        required: false,
        name: "filter_transaction_index_gt",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by transaction index less than or equal to",
          example: 5,
        },
        required: false,
        name: "filter_transaction_index_lte",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by transaction index less than",
          example: 5,
        },
        required: false,
        name: "filter_transaction_index_lt",
        in: "query",
      },
      {
        schema: {
          type: "string",
          enum: ["block_number", "block_timestamp", "transaction_index"],
          description: "Field to sort results by",
          example: "block_number",
        },
        required: false,
        name: "sort_by",
        in: "query",
      },
      {
        schema: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Sort order (asc or desc)",
          example: "desc",
        },
        required: false,
        name: "sort_order",
        in: "query",
      },
      {
        schema: {
          type: "string",
        },
        required: false,
        name: "group_by",
        in: "query",
      },
      {
        schema: {
          type: "array",
          items: {
            type: "string",
          },
        },
        required: false,
        name: "aggregate",
        in: "query",
      },
      {
        schema: {
          type: "string",
          description: "Filter by transaction hash",
          example:
            "0x218b632d932371478d1ae5a01620ebab1a2030f9dad6f8fba4a044ea6335a57e",
        },
        required: false,
        name: "filter_hash",
        in: "query",
      },
      {
        schema: {
          type: "string",
          description: "Filter by from address",
          example: "0xa1e4380a3b1f749673e270229993ee55f35663b4",
        },
        required: false,
        name: "filter_from_address",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by value",
          example: 21000000000000,
        },
        required: false,
        name: "filter_value",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by value greater than or equal to",
          example: 21000000000000,
        },
        required: false,
        name: "filter_value_gte",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by value greater than",
          example: 21000000000000,
        },
        required: false,
        name: "filter_value_gt",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by value less than or equal to",
          example: 21000000000000,
        },
        required: false,
        name: "filter_value_lte",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by value less than",
          example: 21000000000000,
        },
        required: false,
        name: "filter_value_lt",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by gas price",
          example: 50000000000000,
        },
        required: false,
        name: "filter_gas_price",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by gas price greater than or equal to",
          example: 50000000000000,
        },
        required: false,
        name: "filter_gas_price_gte",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by gas price greater than",
          example: 50000000000000,
        },
        required: false,
        name: "filter_gas_price_gt",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by gas price less than or equal to",
          example: 50000000000000,
        },
        required: false,
        name: "filter_gas_price_lte",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by gas price less than",
          example: 50000000000000,
        },
        required: false,
        name: "filter_gas_price_lt",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by gas",
          example: 21000,
        },
        required: false,
        name: "filter_gas",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by gas greater than or equal to",
          example: 21000,
        },
        required: false,
        name: "filter_gas_gte",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by gas greater than",
          example: 21000,
        },
        required: false,
        name: "filter_gas_gt",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by gas less than or equal to",
          example: 21000,
        },
        required: false,
        name: "filter_gas_lte",
        in: "query",
      },
      {
        schema: {
          type: "number",
          description: "Filter by gas less than",
          example: 21000,
        },
        required: false,
        name: "filter_gas_lt",
        in: "query",
      },
      {
        schema: {
          type: "string",
          description: "Filter by function selector",
          example: "0x095ea7b3",
        },
        required: false,
        name: "filter_function_selector",
        in: "query",
      },
      {
        schema: {
          type: "string",
          description: "Filter by to address",
          example: "0xa1e4380a3b1f749673e270229993ee55f35663b4",
        },
        required: false,
        name: "filter_to_address",
        in: "query",
      },
      {
        schema: {
          type: "integer",
          minimum: 0,
          exclusiveMinimum: true,
          default: 20,
          description: "The number of items to return",
          example: 20,
        },
        required: false,
        name: "limit",
        in: "query",
      },
      {
        schema: {
          type: "integer",
          nullable: true,
          minimum: 0,
          default: 0,
          example: 0,
        },
        required: false,
        name: "page",
        in: "query",
      },
    ],
  };

  return {
    test1: test1,
  };
}
