"use client";

import { useMutation } from "@tanstack/react-query";
import { Spinner } from "@workspace/ui/components/spinner";
import { EllipsisIcon, TrashIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import type { Project } from "@/api/project/projects";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/NavLink";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { deleteSession } from "../api/session";
import { deletedSessionsStore } from "../stores";

// TODO - add delete chat confirmation dialog

export function ChatSidebarLink(props: {
  sessionId: string;
  title: string;
  project: Project;
  team_slug: string;
}) {
  const router = useDashboardRouter();
  const pathname = usePathname();
  const isDeletingCurrentPage = pathname.includes(props.sessionId);
  const newChatLink = `/team/${props.team_slug}/${props.project.slug}/ai`;
  const deleteChat = useMutation({
    mutationFn: () => {
      return deleteSession({
        project: props.project,
        sessionId: props.sessionId,
      });
    },
    onSuccess: () => {
      const prev = deletedSessionsStore.getValue();
      deletedSessionsStore.setValue([...prev, props.sessionId]);
      if (isDeletingCurrentPage) {
        router.replace(newChatLink);
      }
    },
  });
  return (
    <div
      className="group relative rounded-lg hover:bg-accent"
      key={props.sessionId}
    >
      <Button
        asChild
        className="h-auto w-full items-center justify-between px-2 py-1.5 text-left text-sm hover:bg-transparent"
        variant="ghost"
      >
        <NavLink
          activeClassName="bg-muted"
          href={`/team/${props.team_slug}/${props.project.slug}/ai/chat/${props.sessionId}`}
        >
          <span className="line-clamp-1 block truncate">{props.title}</span>
        </NavLink>
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="-translate-y-1/2 absolute top-1/2 right-1 z-10 h-auto w-auto bg-accent p-1 opacity-0 hover:bg-zinc-300 group-hover:opacity-100 dark:hover:bg-zinc-700"
            variant="ghost"
          >
            <EllipsisIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-44 p-1" side="right">
          <Button
            className="!text-destructive-text flex w-full justify-start gap-2.5 px-2"
            onClick={() => {
              const promise = deleteChat.mutateAsync();
              toast.promise(promise, {
                error: "Failed to delete chat",
                success: "Chat deleted successfully",
              });
            }}
            variant="ghost"
          >
            {deleteChat.isPending ? (
              <Spinner className="size-4" />
            ) : (
              <TrashIcon className="size-4" />
            )}
            Delete
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
