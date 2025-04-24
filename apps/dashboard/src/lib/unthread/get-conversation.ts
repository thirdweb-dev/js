"use server";
import "server-only";

interface UnthreadUser {
  id: string;
  name: string;
  email: string;
  slackId: string;
  photo: string;
}

interface UnthreadMessage {
  ts: string;
  userId: string;
  userTeamId: string;
  botId: string;
  botName: string;
  text: string;
  subtype: string | null;
  conversationId: string;
  timestamp: string;
  threadTs: string | null;
  conversation: UnthreadConversation;
  user: UnthreadUser | null;
  metadata?: {
    eventType?:
      | "autoresponder_replied"
      | "email_received"
      | "email_explanation_sent"
      | "widget_message_received"
      | "microsoft_teams_message_received"
      | "unthread_outbound"
      | "post_close_template_sent"
      | "customer_view_button"
      | "slack_bot_dm_received";
  };
}

interface UnthreadTag {
  id: string;
  name: string;
}

interface UnthreadCustomer {
  name: string;
  primarySupportAssigneeId: string | null;
  primarySupportAssigneeType: "user" | "team" | null;
  secondarySupportAssigneeId: string | null;
  secondarySupportAssigneeType: "user" | "team" | null;
  replyTimeoutMinutes: number | null;
  defaultTriageChannelId: string | null;
  disableAutomatedTicketing: boolean | null;
  botHandling: "off" | "all" | null;
  // autoresponder: AutoresponderOptions | null;
  // supportSteps: Array<SupportStep> | null;
  slackTeamId: string | null;
  assignToTaggedUserEnabled: boolean | null;
  slackChannelId: string | null;
  createdAt: string;
  updatedAt: string;
  tags: Array<UnthreadTag>;
  // slackChannel: SlackChannel | null;
}

interface UnthreadConversation {
  id: string;
  status: "open" | "in_progress" | "on_hold" | "closed";
  customerId: string | null;
  channelId: string;
  wasManuallyCreated: boolean;
  friendlyId: number;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  statusUpdatedAt: string | null;
  responseTime: number | null;
  responseTimeWorking: number | null;
  resolutionTime: number | null;
  resolutionTimeWorking: number | null;
  title: string | null;
  priority: number | null;
  initialMessage: UnthreadMessage;
  assignedToUserId: UnthreadUser | null;
  tags: Array<UnthreadTag>;
  customer: UnthreadCustomer | null;
  wakeUpAt: string | null;
  summary: string | null;
  snoozedAt: string | null;
  lockedAt: string | null;
  ticketTypeId: string | null;
  ticketTypeFields: Record<string, string>;
  metadata?: Record<string, string>;
  followers?: {
    userId?: string;
    groupId?: string;
    entityId: string;
  }[];
  collaborators?: {
    collaboratorTypeId: string;
    userId?: string;
    groupId?: string;
    entityId: string;
  }[];
}

export async function getUnthreadConversation(
  conversationId: string,
): Promise<UnthreadConversation | null> {
  const res = await fetch(
    `https://api.unthread.io/api/conversations/${conversationId}`,
    {
      headers: {
        "X-Api-Key": process.env.UNTHREAD_API_KEY ?? "",
      },
    },
  );
  if (!res.ok) {
    throw new Error(
      `Error getting conversation: ${res.status} - ${await res.text()}`,
    );
  }
  return (await res.json()) as UnthreadConversation;
}
