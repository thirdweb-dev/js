import { differenceInCalendarDays, format, subDays } from "date-fns";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { normalizeTime } from "@/lib/time";
import { cn } from "@/lib/utils";

export function DateRangeSelector(props: {
  range: Range;
  setRange: (range: Range) => void;
  popoverAlign?: "start" | "end" | "center";
  className?: string;
}) {
  const { range, setRange } = props;
  const daysDiff = differenceInCalendarDays(range.to, range.from);

  const matchingRange =
    normalizeTime(range.to).getTime() === normalizeTime(new Date()).getTime()
      ? durationPresets.find((preset) => preset.days === daysDiff)
      : undefined;

  const rangeType = matchingRange?.id || range.type;
  const rangeLabel = matchingRange?.name || range.label;

  return (
    <DatePickerWithRange
      className={cn("w-auto bg-card", props.className)}
      from={range.from}
      header={
        <div className="mb-2 border-border border-b p-4">
          <Select
            onValueChange={(id: DurationId) => {
              setRange(getLastNDaysRange(id));
            }}
            value={rangeType}
          >
            <SelectTrigger className="flex bg-transparent">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              {durationPresets.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.name}
                </SelectItem>
              ))}

              {rangeType === "custom" && (
                <SelectItem value="custom">
                  {format(range.from, "LLL dd, y")} -{" "}
                  {format(range.to, "LLL dd, y")}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      }
      labelOverride={rangeLabel}
      popoverAlign={props.popoverAlign}
      setFrom={(from) =>
        setRange({
          from,
          to: range.to,
          type: "custom",
        })
      }
      setTo={(to) =>
        setRange({
          from: range.from,
          to,
          type: "custom",
        })
      }
      to={range.to}
    />
  );
}

export function getLastNDaysRange(id: DurationId) {
  const durationInfo = durationPresets.find((preset) => preset.id === id);
  if (!durationInfo) {
    throw new Error(`Invalid duration id: ${id}`);
  }

  const todayDate = new Date(Date.now());

  const value: Range = {
    from: subDays(todayDate, durationInfo.days),
    label: durationInfo.name,
    to: todayDate,
    type: id,
  };

  return value;
}

const durationPresets = [
  {
    days: 7,
    id: "last-7",
    name: "Last 7 Days",
  },
  {
    days: 30,
    id: "last-30",
    name: "Last 30 Days",
  },
  {
    days: 60,
    id: "last-60",
    name: "Last 60 Days",
  },
  {
    days: 120,
    id: "last-120",
    name: "Last 120 Days",
  },
] as const;

export type DurationId = (typeof durationPresets)[number]["id"];

export type Range = {
  type: DurationId | "custom";
  label?: string;
  from: Date;
  to: Date;
};
