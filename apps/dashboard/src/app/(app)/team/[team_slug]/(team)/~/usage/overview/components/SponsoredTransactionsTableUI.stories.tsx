import type { Meta, StoryObj } from "@storybook/nextjs";
import { useId, useState } from "react";
import { projectStub } from "stories/stubs";
import { storybookThirdwebClient } from "stories/utils";
import { ThirdwebProvider } from "thirdweb/react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  type SponsoredTransaction,
  SponsoredTransactionsTableUI,
} from "./SponsoredTransactionsTableUI";

const meta = {
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
  title: "Usage/SponsoredTransactionsTable",
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
    chainId: chainIdsToPick[
      Math.floor(Math.random() * chainIdsToPick.length)
    ] as string,
    projectId:
      mockProjects[Math.floor(Math.random() * mockProjects.length)]?.id || "",
    teamId: crypto.randomUUID(),
    timestamp: new Date(
      Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30,
    ).toISOString(),
    transactionFee: randomVal,
    transactionFeeUsd: feeUsd,
    transactionHash:
      "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    userOpHash:
      "0x0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba",
    walletAddress: "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37",
  } satisfies SponsoredTransaction;
}

export const Default: Story = {
  args: {
    isError: false,
    isPending: false,
    projectLoadingFails: false,
    sponsoredTransactions: new Array(10)
      .fill(null)
      .map(createSponsoredTransactionStub),
    totalPages: 4,
  },
};

export const Loading: Story = {
  args: {
    isError: false,
    isPending: true,
    projectLoadingFails: false,
    sponsoredTransactions: [],
    totalPages: 4,
  },
};

export const NoTransactions: Story = {
  args: {
    isError: false,
    isPending: false,
    projectLoadingFails: false,
    sponsoredTransactions: [],
    totalPages: 1,
  },
};

export const NoPagination: Story = {
  args: {
    isError: false,
    isPending: false,
    projectLoadingFails: false,
    sponsoredTransactions: new Array(5)
      .fill(null)
      .map(createSponsoredTransactionStub),
    totalPages: 1,
  },
};

export const ErrorLoadingTransactions: Story = {
  args: {
    isError: true,
    isPending: false,
    projectLoadingFails: false,
    sponsoredTransactions: [],
    totalPages: 1,
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
  const teamId = useId();
  const projectId = useId();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <RadioGroup
          className="flex items-center gap-4"
          onValueChange={(value) => setVariant(value as "team" | "project")}
          value={variant}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem id={teamId} value="team" />
            <Label htmlFor={teamId}>Team</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem id={projectId} value="project" />
            <Label htmlFor={projectId}>Project</Label>
          </div>
        </RadioGroup>
      </div>

      <SponsoredTransactionsTableUI
        client={storybookThirdwebClient}
        filters={{}}
        getCSV={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return "foo,bar\n1,2\n3,4";
        }}
        isError={props.isError}
        isPending={props.isPending}
        pageNumber={pageNumber}
        pageSize={10}
        projects={mockProjects}
        setFilters={() => {}}
        setPageNumber={setPageNumber}
        sponsoredTransactions={props.sponsoredTransactions}
        teamSlug="foo"
        totalPages={props.totalPages}
        variant={variant}
      />
    </div>
  );
}
