import type { Meta, StoryObj } from "@storybook/react";
import { WebhookLatencyChartUI } from "./WebhookLatencyChartUI";

const meta: Meta<typeof WebhookLatencyChartUI> = {
  component: WebhookLatencyChartUI,
  parameters: {
    layout: "padded",
  },
  title: "Analytics/WebhookLatencyChartUI",
};

export default meta;
type Story = StoryObj<typeof WebhookLatencyChartUI>;

const mockData = [
  {
    date: "2024-01-01",
    p50LatencyMs: 150,
    p90LatencyMs: 300,
    p99LatencyMs: 500,
    webhookId: "webhook-1",
  },
  {
    date: "2024-01-02",
    p50LatencyMs: 175,
    p90LatencyMs: 350,
    p99LatencyMs: 600,
    webhookId: "webhook-1",
  },
  {
    date: "2024-01-03",
    p50LatencyMs: 125,
    p90LatencyMs: 280,
    p99LatencyMs: 450,
    webhookId: "webhook-1",
  },
  {
    date: "2024-01-04",
    p50LatencyMs: 200,
    p90LatencyMs: 400,
    p99LatencyMs: 700,
    webhookId: "webhook-1",
  },
  {
    date: "2024-01-05",
    p50LatencyMs: 160,
    p90LatencyMs: 320,
    p99LatencyMs: 520,
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

export const HighLatency: Story = {
  args: {
    data: [
      {
        date: "2024-01-01",
        p50LatencyMs: 800,
        p90LatencyMs: 1500,
        p99LatencyMs: 3000,
        webhookId: "webhook-1",
      },
      {
        date: "2024-01-02",
        p50LatencyMs: 750,
        p90LatencyMs: 1400,
        p99LatencyMs: 2800,
        webhookId: "webhook-1",
      },
    ],
    isPending: false,
  },
};

export const LowLatency: Story = {
  args: {
    data: [
      {
        date: "2024-01-01",
        p50LatencyMs: 25,
        p90LatencyMs: 60,
        p99LatencyMs: 120,
        webhookId: "webhook-1",
      },
      {
        date: "2024-01-02",
        p50LatencyMs: 30,
        p90LatencyMs: 65,
        p99LatencyMs: 130,
        webhookId: "webhook-1",
      },
    ],
    isPending: false,
  },
};
