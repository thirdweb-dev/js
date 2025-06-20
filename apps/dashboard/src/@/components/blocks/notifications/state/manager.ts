"use client";

import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  getArchivedNotifications,
  getUnreadNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  type Notification,
  type NotificationsApiResponse,
} from "@/api/notifications";

/**
 * Internal helper to safely flatten pages coming from useInfiniteQuery.
 */
function flattenPages<T extends { result: Notification[] }>(
  data?: InfiniteData<T>,
): Notification[] {
  return data?.pages.flatMap((p) => p.result) ?? [];
}

/**
 * React hook that provides notifications state with optimistic archiving.
 *
 * Example:
 * ```tsx
 * const {
 *   unreadNotifications,
 *   archivedNotifications,
 *   unreadCount,
 *   markAsRead,
 *   markAllAsRead,
 *   loadMoreUnread,
 *   loadMoreArchived,
 *   hasMoreUnread,
 *   hasMoreArchived,
 * } = useNotifications();
 * ```
 */

export function useNotifications(accountId: string) {
  const queryClient = useQueryClient();

  // --------------------
  //   Query definitions
  // --------------------

  const unreadQueryKey = useMemo(
    () => ["notifications", "unread", { accountId }],
    [accountId],
  );
  const archivedQueryKey = useMemo(
    () => ["notifications", "archived", { accountId }],
    [accountId],
  );
  const unreadCountKey = useMemo(
    () => ["notifications", "unread-count", { accountId }],
    [accountId],
  );

  const unreadQuery = useInfiniteQuery<NotificationsApiResponse>({
    enabled: !!accountId,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const cursor = (pageParam ?? undefined) as string | undefined;
      const res = await getUnreadNotifications(cursor);
      if (res.status === "error") {
        throw new Error(res.reason ?? "unknown");
      }
      return res.data;
    },
    queryKey: unreadQueryKey,
    refetchInterval: 60_000, // 1min
  });

  const archivedQuery = useInfiniteQuery<NotificationsApiResponse>({
    enabled: !!accountId,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const cursor = (pageParam ?? undefined) as string | undefined;
      const res = await getArchivedNotifications(cursor);
      if (res.status === "error") {
        throw new Error(res.reason ?? "unknown");
      }
      return res.data;
    },
    queryKey: archivedQueryKey,
    refetchInterval: 60_000, // 1min
  });

  const unreadCountQuery = useQuery({
    enabled: !!accountId,
    queryFn: async () => {
      const res = await getUnreadNotificationsCount();
      if (res.status === "error") {
        throw new Error(res.reason ?? "unknown");
      }
      return res.data.result.unreadCount;
    },
    queryKey: unreadCountKey, // 1min
    refetchInterval: 60_000,
  });

  // --------------------
  //   Mutation (archive)
  // --------------------
  const archiveMutation = useMutation({
    mutationFn: async (notificationId?: string) => {
      const res = await markNotificationAsRead(notificationId);
      if (res.status === "error") {
        toast.error("Failed to mark notification as read");
        throw new Error(res.reason ?? "unknown");
      }
      return { notificationId } as const;
    },
    // Optimistic update
    onMutate: async (notificationId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: unreadQueryKey }),
        queryClient.cancelQueries({ queryKey: archivedQueryKey }),
      ]);

      const previousUnread =
        queryClient.getQueryData<InfiniteData<NotificationsApiResponse>>(
          unreadQueryKey,
        );

      const previousCount = queryClient.getQueryData<number>(unreadCountKey);

      let optimisticUnread: InfiniteData<NotificationsApiResponse> | undefined;
      let optimisticCount: number | undefined;

      if (previousUnread) {
        if (notificationId) {
          // Remove a single notification
          optimisticUnread = {
            ...previousUnread,
            pages: previousUnread.pages.map((page) => ({
              ...page,
              result: page.result.filter((n) => n.id !== notificationId),
            })),
          };
          if (typeof previousCount === "number") {
            optimisticCount = Math.max(previousCount - 1, 0);
          }
        } else {
          // Clear all unread notifications
          optimisticUnread = {
            ...previousUnread,
            pages: previousUnread.pages.map((page) => ({
              ...page,
              result: [],
            })),
          };
          optimisticCount = 0;
        }
        queryClient.setQueryData(unreadQueryKey, optimisticUnread);
      }

      if (typeof optimisticCount === "number") {
        queryClient.setQueryData(unreadCountKey, optimisticCount);
      }

      return { previousCount, previousUnread } as const;
    },
    // Always refetch to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: unreadQueryKey });
      queryClient.invalidateQueries({ queryKey: archivedQueryKey });
      queryClient.invalidateQueries({ queryKey: unreadCountKey });
    },
  });

  // --------------------
  //    Derived helpers
  // --------------------
  const unreadNotifications = flattenPages(unreadQuery.data);
  const archivedNotifications = flattenPages(archivedQuery.data);
  const unreadNotificationsCount = unreadCountQuery.data ?? 0; // this is the total unread count

  return {
    archivedNotifications,
    hasMoreArchived: archivedQuery.hasNextPage ?? false,
    hasMoreUnread: unreadQuery.hasNextPage ?? false,
    isFetchingMoreArchived: archivedQuery.isFetchingNextPage,
    isFetchingMoreUnread: unreadQuery.isFetchingNextPage,
    isLoadingArchived: archivedQuery.isLoading,

    // booleans
    isLoadingUnread: unreadQuery.isLoading,
    loadMoreArchived: () => archivedQuery.fetchNextPage(),

    // pagination helpers
    loadMoreUnread: () => unreadQuery.fetchNextPage(),
    markAllAsRead: () => archiveMutation.mutate(undefined),

    // mutations
    markAsRead: (id: string) => archiveMutation.mutate(id),
    // data
    unreadNotifications,
    unreadNotificationsCount,
  } as const;
}
