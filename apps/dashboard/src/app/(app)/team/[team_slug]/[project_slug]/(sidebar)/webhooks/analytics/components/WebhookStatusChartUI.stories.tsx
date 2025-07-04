import type { Meta, StoryObj } from "@storybook/react";
import { WebhookStatusChartUI } from "./WebhookStatusChartUI";

const meta: Meta<typeof WebhookStatusChartUI> = {
  component: WebhookStatusChartUI,
  parameters: {
    layout: "padded",
  },
  title: "Analytics/WebhookStatusChartUI",
};

export default meta;
type Story = StoryObj<typeof WebhookStatusChartUI>;

const mockData = [
  {
    date: "2024-01-01",
    httpStatusCode: 200,
    totalRequests: 145,
    webhookId: "webhook-1",
  },
  {
    date: "2024-01-01",
    httpStatusCode: 404,
    totalRequests: 12,
    webhookId: "webhook-1",
  },
  {
    date: "2024-01-01",
    httpStatusCode: 500,
    totalRequests: 3,
    webhookId: "webhook-1",
  },
  {
    date: "2024-01-02",
    httpStatusCode: 200,
    totalRequests: 178,
    webhookId: "webhook-1",
  },
  {
    date: "2024-01-02",
    httpStatusCode: 404,
    totalRequests: 8,
    webhookId: "webhook-1",
  },
  {
    date: "2024-01-02",
    httpStatusCode: 500,
    totalRequests: 1,
    webhookId: "webhook-1",
  },
  {
    date: "2024-01-03",
    httpStatusCode: 200,
    totalRequests: 203,
    webhookId: "webhook-1",
  },
  {
    date: "2024-01-03",
    httpStatusCode: 404,
    totalRequests: 15,
    webhookId: "webhook-1",
  },
];

export const Default: Story = {
  args: {
    data: mockData,
    isPending: false,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    isPending: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    isPending: false,
  },
};

export const MixedStatusCodes: Story = {
  args: {
    data: [
      {
        date: "2024-01-01",
        httpStatusCode: 200,
        totalRequests: 100,
        webhookId: "webhook-1",
      },
      {
        date: "2024-01-01",
        httpStatusCode: 301,
        totalRequests: 25,
        webhookId: "webhook-1",
      },
      {
        date: "2024-01-01",
        httpStatusCode: 404,
        totalRequests: 10,
        webhookId: "webhook-1",
      },
      {
        date: "2024-01-01",
        httpStatusCode: 500,
        totalRequests: 5,
        webhookId: "webhook-1",
      },
    ],
    isPending: false,
  },
};
