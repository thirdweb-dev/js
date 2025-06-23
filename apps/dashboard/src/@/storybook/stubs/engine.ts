import type {
  EngineAlert,
  EngineAlertRule,
  EngineNotificationChannel,
} from "@/hooks/useEngine";

export function createEngineAlertRuleStub(
  id: string,
  overrides: Partial<EngineAlertRule> = {},
): EngineAlertRule {
  return {
    createdAt: new Date(),
    description: `This is a description for alert rule ${id}`,
    id: `alert-rule-${id}`,
    pausedAt: null,
    routingKey: `alert.${id}`,
    title: `Alert Rule ${id}`,
    ...overrides,
  };
}

export function createEngineNotificationChannelStub(
  id: string,
  overrides: Partial<EngineNotificationChannel> = {},
): EngineNotificationChannel {
  return {
    createdAt: new Date(),
    id: Math.random().toString(),
    pausedAt: new Date(),
    subscriptionRoutes: [`alert.${id}`],
    type: "slack",
    value:
      "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
    ...overrides,
  };
}

export function createEngineAlertStub(
  id: string,
  overrides: Partial<EngineAlert> = {},
): EngineAlert {
  return {
    alertRuleId: `alert-rule-${id}`,
    endsAt: new Date(),
    id: Math.random().toString(),
    startsAt: new Date(),
    status: "pending",
    ...overrides,
  };
}
