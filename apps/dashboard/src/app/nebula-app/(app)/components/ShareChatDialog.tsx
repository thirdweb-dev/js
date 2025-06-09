import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { ShareIcon } from "lucide-react";
import type { SessionInfo } from "../api/types";

export function ShareChatDialog(props: {
  session: SessionInfo;
}) {
  return <ShareChatDialogUI session={props.session} />;
}

export function ShareChatDialogUI(props: {
  session: SessionInfo;
  onMakePublic?: () => void;
}) {
  let content = undefined;

  if (props.session.is_public) {
    content = (
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Chat</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={`/chat/${props.session.id}`}
              readOnly
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    );
  } else {
    content = (
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share chat</DialogTitle>
          <DialogDescription>
            You need to make this chat public in order to share it. This means
            that anyone with its link will be able to access it and view its
            content.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={props.onMakePublic}
          >
            Make public
          </Button>
        </DialogFooter>
      </DialogContent>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="!h-auto w-auto shrink-0 gap-2 p-2">
          <ToolTipLabel label="Share Chat">
            <ShareIcon className="size-4" />
          </ToolTipLabel>
        </Button>
      </DialogTrigger>
      {content}
    </Dialog>
  );
}
