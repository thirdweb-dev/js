import { get, set } from "idb-keyval";
import type { NotificationMetadata } from "./NotificationButton";

type ChangelogItem = {
  published_at: string;
  title: string;
  id: string;
  url: string;
};

// Note: This saving read notifications in IndexedDB is temporary implementation - This will soon be replaced by a proper API setup

const READ_NOTIFICATIONS_KEY = "thirdweb:read-notifications";

// get set of notification ids marked as read
async function getReadNotificationIds(): Promise<Set<string>> {
  const readIds = (await get<string[]>(READ_NOTIFICATIONS_KEY)) || [];
  return new Set(readIds);
}

// fetches last 20 posts with tag "changelog" notifications
async function fetchGhostPosts(tag: string) {
  const res = await fetch(
    `https://thirdweb.ghost.io/ghost/api/content/posts/?key=49c62b5137df1c17ab6b9e46e3&fields=id,title,url,published_at&filter=tag:${tag}&visibility:public&limit=20`,
  );
  const json = await res.json();
  return json.posts as ChangelogItem[];
}

// Clean up the indexedDB storage of read notification IDs
// This is to prevent the storage from growing indefinitely
// Remove notification IDs from storage that are no longer shown to the user
export async function cleanupReadNotifications(
  notifications: NotificationMetadata[],
) {
  const readIds = await getReadNotificationIds();

  // Get all current notification IDs
  const currentIds = new Set([...notifications.map((item) => item.id)]);

  // remove ids that are no longer being displayed
  const usedIds = new Set(
    Array.from(readIds).filter((id) => currentIds.has(id)),
  );

  await set(READ_NOTIFICATIONS_KEY, Array.from(usedIds));
}

export async function markNotificationAsRead(id: string) {
  const readIds = await getReadNotificationIds();
  readIds.add(id);

  // Clean up old notification IDs periodically (every 10th notification marked as read)
  await set(READ_NOTIFICATIONS_KEY, Array.from(readIds));
}

export async function getInboxNotifications(): Promise<NotificationMetadata[]> {
  const [changelogs, readIds] = await Promise.all([
    fetchGhostPosts("update"),
    getReadNotificationIds(),
  ]);

  return changelogs.map((item) => ({
    id: item.id,
    title: item.title,
    href: item.url,
    isRead: readIds.has(item.id),
    createdAt: item.published_at,
  }));
}
