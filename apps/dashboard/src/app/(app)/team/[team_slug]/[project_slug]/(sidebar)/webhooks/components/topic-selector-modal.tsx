"use client";

import { useMemo, useState } from "react";
import type { Topic } from "@/api/webhook-configs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TopicSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topics: Topic[];
  selectedTopicIds: string[];
  onSelectionChange: (topicIds: string[]) => void;
}

export function TopicSelectorModal(props: TopicSelectorModalProps) {
  const [tempSelection, setTempSelection] = useState<string[]>(
    props.selectedTopicIds,
  );

  const groupedTopics = useMemo(() => {
    const groups: Record<string, Topic[]> = {};

    props.topics.forEach((topic) => {
      const service = topic.id.split(".")[0] || "other";
      if (!groups[service]) {
        groups[service] = [];
      }
      groups[service].push(topic);
    });

    // Sort groups by service name and topics within each group
    const sortedGroups: Record<string, Topic[]> = {};
    Object.keys(groups)
      .sort()
      .forEach((service) => {
        sortedGroups[service] =
          groups[service]?.sort((a, b) => a.id.localeCompare(b.id)) || [];
      });

    return sortedGroups;
  }, [props.topics]);

  function handleTopicToggle(topicId: string, checked: boolean) {
    if (checked) {
      setTempSelection((prev) => [...prev, topicId]);
    } else {
      setTempSelection((prev) => prev.filter((id) => id !== topicId));
    }
  }

  function handleSave() {
    props.onSelectionChange(tempSelection);
    props.onOpenChange(false);
  }

  function handleCancel() {
    setTempSelection(props.selectedTopicIds);
    props.onOpenChange(false);
  }

  return (
    <Dialog onOpenChange={handleCancel} open={props.open}>
      <DialogContent className="max-h-[80vh] max-w-2xl p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <DialogTitle className="font-semibold text-xl tracking-tight">
            Select Topics
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 min-h-0">
          <div className="space-y-6 pb-4">
            {Object.entries(groupedTopics).map(([service, topics]) => (
              <div key={service}>
                <h3 className="font-medium text-sm mb-4 text-foreground capitalize">
                  {service}
                </h3>
                <div className="space-y-3 ml-4">
                  {topics.map((topic) => (
                    <div className="flex items-start space-x-3" key={topic.id}>
                      <Checkbox
                        checked={tempSelection.includes(topic.id)}
                        id={topic.id}
                        onCheckedChange={(checked) =>
                          handleTopicToggle(topic.id, !!checked)
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          htmlFor={topic.id}
                        >
                          {topic.id}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-4 border-border border-t bg-card p-6 lg:gap-2 flex-shrink-0">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Select {tempSelection.length} Topic
            {tempSelection.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
