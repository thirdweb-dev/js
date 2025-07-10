"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";

const TOPIC_IDS_THAT_SUPPORT_FILTERS = [
  "insight.event.confirmed",
  "insight.transaction.confirmed",
];

interface TopicSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topics: Topic[];
  selectedTopics: { id: string; filters: object | null }[];
  onSelectionChange: (topics: { id: string; filters: object | null }[]) => void;
}

export function TopicSelectorModal(props: TopicSelectorModalProps) {
  const [tempSelection, setTempSelection] = useState<
    { id: string; filters: object | null }[]
  >(props.selectedTopics);

  // Initialize topicFilters with existing filters
  const [topicFilters, setTopicFilters] = useState<Record<string, string>>(
    () => {
      const initialFilters: Record<string, string> = {};
      props.selectedTopics.forEach((topic) => {
        if (topic.filters) {
          initialFilters[topic.id] = JSON.stringify(topic.filters, null, 2);
        }
      });
      return initialFilters;
    },
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
      // Preserve existing filters if re-selecting a topic
      const existingTopic = props.selectedTopics.find((t) => t.id === topicId);
      setTempSelection((prev) => [
        ...prev,
        { id: topicId, filters: existingTopic?.filters || null },
      ]);
    } else {
      setTempSelection((prev) => prev.filter((topic) => topic.id !== topicId));
    }
  }

  function handleSave() {
    const processedSelection = tempSelection.map((topic) => {
      const filters = topicFilters[topic.id];
      if (filters) {
        try {
          return { ...topic, filters: JSON.parse(filters) };
        } catch (_error) {
          toast.error(`Invalid JSON in filters for ${topic.id}`);
          throw new Error(`Invalid JSON in filters for ${topic.id}`);
        }
      }
      return topic;
    });

    props.onSelectionChange(processedSelection);
    props.onOpenChange(false);
  }

  function handleCancel() {
    setTempSelection(props.selectedTopics);
    // Reset filter texts to original values
    const originalFilters: Record<string, string> = {};
    props.selectedTopics.forEach((topic) => {
      if (topic.filters) {
        originalFilters[topic.id] = JSON.stringify(topic.filters, null, 2);
      }
    });
    setTopicFilters(originalFilters);
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
                        checked={tempSelection.some((t) => t.id === topic.id)}
                        id={topic.id}
                        onCheckedChange={(checked) =>
                          handleTopicToggle(topic.id, !!checked)
                        }
                      />
                      <div className="grid gap-1.5 leading-none flex-1">
                        <label
                          className="text-sm font-mono font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          htmlFor={topic.id}
                        >
                          {topic.id}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {topic.description}
                        </p>

                        {/* Show textarea when selecting a topic that supports filters */}
                        {TOPIC_IDS_THAT_SUPPORT_FILTERS.includes(topic.id) &&
                          tempSelection.some((t) => t.id === topic.id) && (
                            <div className="mt-2">
                              <Textarea
                                placeholder={`{\n  "key": "value"\n}`}
                                rows={3}
                                value={topicFilters[topic.id] || ""}
                                onChange={(e) => {
                                  setTopicFilters((prev) => ({
                                    ...prev,
                                    [topic.id]: e.target.value,
                                  }));
                                }}
                                className="text-xs"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Enter JSON filters (optional). Leave empty to
                                receive all events.
                              </p>
                            </div>
                          )}
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
