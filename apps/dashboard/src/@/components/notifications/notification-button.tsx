"use client";

import { BellIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { NotificationList } from "./notification-list";
import { useNotifications } from "./state/manager";

export function NotificationsButton(props: { accountId: string }) {
  const manager = useNotifications(props.accountId);
  const [open, setOpen] = useState(false);

  const isMobile = useIsMobile();

  const trigger = useMemo(
    () => (
      <Button className="relative rounded-full" size="icon" variant="outline">
        <BellIcon className="h-4 w-4" />
        {(manager.unreadNotificationsCount || 0) > 0 && (
          <span className="absolute top-0 right-0 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
        )}
      </Button>
    ),
    [manager.unreadNotificationsCount],
  );

  if (isMobile) {
    return (
      <Drawer onOpenChange={setOpen} open={open}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[90vh] min-h-[66vh]">
          <DrawerTitle className="sr-only">Notifications</DrawerTitle>
          <NotificationList {...manager} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-h-[90vh] min-h-[500px] w-[400px] max-w-md p-0"
      >
        <NotificationList {...manager} />
      </PopoverContent>
    </Popover>
  );
}
