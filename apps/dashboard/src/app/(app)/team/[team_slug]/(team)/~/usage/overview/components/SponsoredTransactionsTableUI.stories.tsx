import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { projectStub } from "stories/stubs";
import { storybookThirdwebClient } from "stories/utils";
import { ThirdwebProvider } from "thirdweb/react";
import {
  type SponsoredTransaction,
  SponsoredTransactionsTableUI,
} from "./SponsoredTransactionsTableUI";

const meta = {
  title: "Usage/SponsoredTransactionsTable",
  component: Variant,
  decorators: [
    (Story) => (
      <div className="container max-w-[1154px] py-10">
        <ThirdwebProvider>
          <Story />
        </ThirdwebProvider>
      </div>
    ),
  ],
} satisfies Meta<typeof Variant>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockProjects = [
  projectStub("foo", "team-1"),
  projectStub("bar", "team-1"),
  projectStub("baz", "team-1"),
];

function createSponsoredTransactionStub() {
  const chainIdsToPick = ["1", "137", "8453", "42161", "10", "100"];
  const randomVal = Math.random();
  const feeMode = randomVal < 0.2 ? "low" : randomVal < 0.4 ? "zero" : "high";
  const feeUsd =
    feeMode === "low"
      ? Math.random() / 100
      : feeMode === "zero"
        ? 0
        : Math.random();

  return {
    timestamp: new Date(
      Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30,
    ).toISOString(),
    teamId: crypto.randomUUID(),
    projectId:
      mockProjects[Math.floor(Math.random() * mockProjects.length)]?.id || "",
    chainId: chainIdsToPick[
      Math.floor(Math.random() * chainIdsToPick.length)
    ] as string,
    transactionFee: randomVal,
    transactionFeeUsd: feeUsd,
    walletAddress: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
    transactionHash:
      "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    userOpHash:
      "0x0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba",
  } satisfies SponsoredTransaction;
}

export const Default: Story = {
  args: {
    totalPages: 4,
    sponsoredTransactions: new Array(10)
      .fill(null)
      .map(createSponsoredTransactionStub),
    isPending: false,
    projectLoadingFails: false,
    isError: false,
  },
};

export const Loading: Story = {
  args: {
    totalPages: 4,
    sponsoredTransactions: [],
    isPending: true,
    projectLoadingFails: false,
    isError: false,
  },
};

export const NoTransactions: Story = {
  args: {
    totalPages: 1,
    sponsoredTransactions: [],
    isPending: false,
    projectLoadingFails: false,
    isError: false,
  },
};

export const NoPagination: Story = {
  args: {
    totalPages: 1,
    sponsoredTransactions: new Array(5)
      .fill(null)
      .map(createSponsoredTransactionStub),
    isPending: false,
    projectLoadingFails: false,
    isError: false,
  },
};

export const ErrorLoadingTransactions: Story = {
  args: {
    totalPages: 1,
    sponsoredTransactions: [],
    isPending: false,
    projectLoadingFails: false,
    isError: true,
  },
};

function Variant(props: {
  sponsoredTransactions: SponsoredTransaction[];
  isPending: boolean;
  projectLoadingFails: boolean;
  totalPages: number;
  isError: boolean;
}) {
  const [variant, setVariant] = useState<"team" | "project">("team");
  const [pageNumber, setPageNumber] = useState(1);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <RadioGroup
          value={variant}
          onValueChange={(value) => setVariant(value as "team" | "project")}
          className="flex items-center gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="team" id="team" />
            <Label htmlFor="team">Team</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="project" id="project" />
            <Label htmlFor="project">Project</Label>
          </div>
        </RadioGroup>
      </div>

      <SponsoredTransactionsTableUI
        projects={mockProjects}
        getCSV={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return "foo,bar\n1,2\n3,4";
        }}
        filters={{}}
        setFilters={() => {}}
        isError={props.isError}
        client={storybookThirdwebClient}
        totalPages={props.totalPages}
        isPending={props.isPending}
        pageNumber={pageNumber}
        pageSize={10}
        setPageNumber={setPageNumber}
        sponsoredTransactions={props.sponsoredTransactions}
        teamSlug="foo"
        variant={variant}
      />
    </div>
  );
}
