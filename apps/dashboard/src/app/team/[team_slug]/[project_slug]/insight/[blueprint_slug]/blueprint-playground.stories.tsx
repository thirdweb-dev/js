import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { randomLorem } from "../../../../../../stories/stubs";
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
      <Variant metadata={getBlueprintMetadata().test1} isInsightEnabled />
      <Variant
        metadata={getBlueprintMetadata().largeNumberOfParamsMetadata}
        isInsightEnabled
      />
      <Variant
        metadata={getBlueprintMetadata().largeNumberOfParamsMetadata}
        isInsightEnabled
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
  const fewParams: BlueprintPathMetadata = {
    parameters: [
      {
        type: "string",
        description: "Filter parameters",
        name: "filter",
        in: "query",
      },
      {
        type: "string",
        description: "Field to group results by",
        name: "group_by",
        in: "query",
      },
      {
        type: "string",
        description: "Field to sort results by",
        name: "sort_by",
        in: "query",
      },
      {
        type: "string",
        description: "Sort order (asc or desc)",
        name: "sort_order",
        in: "query",
      },
      {
        type: "integer",
        description: "Page number for pagination",
        name: "page",
        in: "query",
      },
      {
        type: "integer",
        default: 5,
        description: "Number of items per page",
        name: "limit",
        in: "query",
      },
      {
        type: "array",
        description: "List of aggregate functions to apply",
        name: "aggregate",
        in: "query",
      },
    ],
    description: randomLorem(15),
    summary: "Test 1",
  };

  const largeNumberOfParamsMetadata: BlueprintPathMetadata = {
    parameters: new Array(20).fill(null).map((_v, i) => {
      return {
        name: `param-name-${i}`,
        in: Math.random() > 0.5 ? "path" : "query",
        type: "string",
        required: Math.random() > 0.5,
        description: `Description for param ${i}`,
      };
    }),
    description: "This blueprint has a large number of parameters",
    summary: "Large number of parameters",
  };

  return {
    test1: fewParams,
    largeNumberOfParamsMetadata,
  };
}
