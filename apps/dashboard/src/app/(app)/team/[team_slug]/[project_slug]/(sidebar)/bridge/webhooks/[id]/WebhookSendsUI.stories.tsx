import type { Meta, StoryObj } from "@storybook/nextjs";
import type {
  getWebhookSends,
  WebhookSend,
} from "@/api/universal-bridge/developer";
import { WebhookSendsUI } from "./webhook-sends";

const meta = {
  title: "app/webhooks/WebhookSendsUI",
  component: WebhookSendsUI,
  decorators: [
    (Story) => (
      <div className="container max-w-7xl py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WebhookSendsUI>;

export default meta;
type Story = StoryObj<typeof meta>;

type WebhookSendResult = Awaited<ReturnType<typeof getWebhookSends>>;

function createMockWebhookSendItem(): WebhookSend {
  const type = Math.random() > 0.5 ? "onramp" : "bridge";
  const status =
    Math.random() > 0.5
      ? "PENDING"
      : Math.random() > 0.5
        ? "COMPLETED"
        : "FAILED";

  const responseStatus =
    Math.random() > 0.5 ? (Math.random() > 0.5 ? 200 : 500) : 404;

  const responseType = Math.random() > 0.5 ? "json" : "text";

  return {
    id: crypto.randomUUID(),
    webhookId: "8fa29fe7-95a9-4b70-97a6-7e80504f5a75",
    webhookUrl: "https://example.webhook/foo/bar",
    paymentId:
      "0x9620fef2c2267b223b8e998b1453b15324acf3ac03e531c9b60c38d6a02843cb",
    transactionId:
      type === "bridge"
        ? "0x79fa097789678db4fcb8712d49133a9447e0039c8a8f93be0cfe3664ac304b80"
        : null,
    onrampId: type === "onramp" ? crypto.randomUUID() : null,
    status: status,
    body: {
      version: 1,
      type: type === "bridge" ? "pay.onchain-transaction" : undefined,
      data:
        type === "bridge"
          ? {
              buyWithCryptoStatus: {
                quote: {
                  fromToken: {
                    chainId: 42161,
                    tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                    decimals: 18,
                    priceUSDCents: 452169,
                    name: "Ether",
                    symbol: "ETH",
                  },
                  toToken: {
                    chainId: 8453,
                    tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                    decimals: 18,
                    priceUSDCents: 451824,
                    name: "Ether",
                    symbol: "ETH",
                  },
                  fromAmountWei: "101000000000000",
                  fromAmount: "0.000101",
                  toAmountWei: "100000000000000",
                  toAmount: "0.0001",
                  toAmountMin: "0.0001",
                  toAmountMinWei: "100000000000000",
                  estimated: {
                    fromAmountUSDCents: 46,
                    toAmountMinUSDCents: 45,
                    toAmountUSDCents: 45,
                    slippageBPS: 0,
                    feesUSDCents: 0,
                    gasCostUSDCents: 0,
                    durationSeconds: 60,
                  },
                  createdAt: "2025-09-16T23:20:53.228Z",
                },
                status: "PENDING",
                subStatus: "NONE",
                fromAddress: "0x2a4f24f935eb178e3e7ba9b53a5ee6d8407c0709",
                toAddress: "0x2a4f24f935eb178e3e7ba9b53a5ee6d8407c0709",
                bridge: "Universal Bridge",
              },
            }
          : {
              buyWithFiatStatus: {
                intentId: "9833815f-77b8-4e3e-b0cf-b8741be16ede",
                fromAddress: "0x0000000000000000000000000000000000000000",
                toAddress: "0xEbE5C4774fd4eEA444094367E01d26f0771e248b",
                status: "PENDING",
                quote: {
                  createdAt: "2025-06-19T18:32:42.092Z",
                  estimatedOnRampAmount: "0.002",
                  estimatedOnRampAmountWei: "2000000000000000",
                  estimatedToTokenAmount: "0.002",
                  estimatedToTokenAmountWei: "2000000000000000",
                  onRampToken: {
                    chainId: 42161,
                    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                    symbol: "ETH",
                    name: "Ether",
                    decimals: 18,
                    priceUsd: 2511.635965,
                    iconUri: "https://assets.relay.link/icons/1/light.png",
                  },
                  toToken: {
                    chainId: 42161,
                    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                    symbol: "ETH",
                    name: "Ether",
                    decimals: 18,
                    priceUsd: 2511.635965,
                    iconUri: "https://assets.relay.link/icons/1/light.png",
                  },
                  estimatedDurationSeconds: 60,
                },
                failureMessage: "",
                purchaseData: null,
              },
            },
    },
    success: true,
    responseStatus: responseStatus,
    response:
      responseType === "json"
        ? '{ "message": "Success" }'
        : "This is a plaintext response",
    createdAt: "2025-09-16T23:20:53.981Z",
  };
}

function createMockWebhookSendResult(length: number): WebhookSendResult {
  return {
    data: Array.from({ length }, createMockWebhookSendItem),
    pagination: {
      limit: 10,
      offset: 0,
      total: 100,
    },
  };
}

const mockEmptyWebhookSendResult: WebhookSendResult = {
  data: [],
  pagination: {
    limit: 10,
    offset: 0,
    total: 0,
  },
};

export const Loading: Story = {
  args: {
    webhookId: "mock-webhook-id",
    authToken: "mock-auth-token",
    projectClientId: "mock-project-id",
    teamId: "mock-team-id",
    getWebhookSends: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000000));
      return createMockWebhookSendResult(1);
    },
    resendWebhook: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    },
  },
};

export const TenResults: Story = {
  args: {
    webhookId: "mock-webhook-id",
    authToken: "mock-auth-token",
    projectClientId: "mock-project-id",
    teamId: "mock-team-id",
    getWebhookSends: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return createMockWebhookSendResult(10);
    },
    resendWebhook: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    },
  },
};

export const OneResult: Story = {
  args: {
    webhookId: "mock-webhook-id",
    authToken: "mock-auth-token",
    projectClientId: "mock-project-id",
    teamId: "mock-team-id",
    getWebhookSends: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return createMockWebhookSendResult(1);
    },
    resendWebhook: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    },
  },
};

export const FewResults: Story = {
  args: {
    webhookId: "mock-webhook-id",
    authToken: "mock-auth-token",
    projectClientId: "mock-project-id",
    teamId: "mock-team-id",
    getWebhookSends: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return createMockWebhookSendResult(3);
    },
    resendWebhook: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    },
  },
};

export const NoResults: Story = {
  args: {
    webhookId: "mock-webhook-id",
    authToken: "mock-auth-token",
    projectClientId: "mock-project-id",
    teamId: "mock-team-id",
    getWebhookSends: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockEmptyWebhookSendResult;
    },
    resendWebhook: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    },
  },
};

export const ErrorState: Story = {
  args: {
    webhookId: "mock-webhook-id",
    authToken: "mock-auth-token",
    projectClientId: "mock-project-id",
    teamId: "mock-team-id",
    getWebhookSends: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      throw new Error("Failed to fetch webhook sends");
    },
    resendWebhook: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    },
  },
};

export const ResendError: Story = {
  args: {
    webhookId: "mock-webhook-id",
    authToken: "mock-auth-token",
    projectClientId: "mock-project-id",
    teamId: "mock-team-id",
    getWebhookSends: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return createMockWebhookSendResult(1);
    },
    resendWebhook: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      throw new Error("Failed to resend webhook");
    },
  },
};
