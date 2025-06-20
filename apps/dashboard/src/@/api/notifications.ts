"use server";

import "server-only";
import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "../constants/public-envs";

export type Notification = {
  id: string;
  createdAt: string;
  accountId: string;
  teamId: string | null;
  description: string;
  readAt: string | null;
  ctaText: string;
  ctaUrl: string;
};

export type NotificationsApiResponse = {
  result: Notification[];
  nextCursor?: string;
};

export async function getUnreadNotifications(cursor?: string) {
  const authToken = await getAuthToken();
  if (!authToken) {
    throw new Error("No auth token found");
  }
  const url = new URL(
    "/v1/dashboard-notifications/unread",
    NEXT_PUBLIC_THIRDWEB_API_HOST,
  );
  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!response.ok) {
    const body = await response.text();
    return {
      body,
      reason: "unknown",
      status: "error",
    } as const;
  }

  const data = (await response.json()) as NotificationsApiResponse;

  return {
    data,
    status: "success",
  } as const;
}

export async function getArchivedNotifications(cursor?: string) {
  const authToken = await getAuthToken();
  if (!authToken) {
    throw new Error("No auth token found");
  }

  const url = new URL(
    "/v1/dashboard-notifications/archived",
    NEXT_PUBLIC_THIRDWEB_API_HOST,
  );
  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!response.ok) {
    const body = await response.text();
    return {
      body,
      reason: "unknown",
      status: "error",
    } as const;
  }

  const data = (await response.json()) as NotificationsApiResponse;

  return {
    data,
    status: "success",
  } as const;
}

export async function getUnreadNotificationsCount() {
  const authToken = await getAuthToken();
  if (!authToken) {
    throw new Error("No auth token found");
  }

  const url = new URL(
    "/v1/dashboard-notifications/unread-count",
    NEXT_PUBLIC_THIRDWEB_API_HOST,
  );
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!response.ok) {
    const body = await response.text();
    return {
      body,
      reason: "unknown",
      status: "error",
    } as const;
  }
  const data = (await response.json()) as {
    result: {
      unreadCount: number;
    };
  };
  return {
    data,
    status: "success",
  } as const;
}

export async function markNotificationAsRead(notificationId?: string) {
  const authToken = await getAuthToken();
  if (!authToken) {
    throw new Error("No auth token found");
  }
  const url = new URL(
    "/v1/dashboard-notifications/mark-as-read",
    NEXT_PUBLIC_THIRDWEB_API_HOST,
  );
  const response = await fetch(url, {
    // if notificationId is provided, mark it as read, otherwise mark all as read
    body: JSON.stringify(notificationId ? { notificationId } : {}),
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
  });
  if (!response.ok) {
    const body = await response.text();
    return {
      body,
      reason: "unknown",
      status: "error",
    } as const;
  }
  return {
    status: "success",
  } as const;
}
