import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subDays } from "date-fns";

export function DateRangeSelector(props: {
  range: Range;
  setRange: (range: Range) => void;
}) {
  const { range, setRange } = props;

  return (
    <DatePickerWithRange
      from={range.from}
      to={range.to}
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
      header={
        <div className="mb-2 border-border border-b p-4">
          <Select
            value={range.type}
            onValueChange={(id: DurationId) => {
              setRange(getLastNDaysRange(id));
            }}
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

              {range.type === "custom" && (
                <SelectItem value="custom">
                  {format(range.from, "LLL dd, y")} -{" "}
                  {format(range.to, "LLL dd, y")}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      }
      labelOverride={range.label}
      className="w-auto bg-card"
    />
  );
}

export function getLastNDaysRange(id: DurationId) {
  const durationInfo = durationPresets.find((preset) => preset.id === id);
  if (!durationInfo) {
    throw new Error("Invalid duration id");
  }

  const todayDate = new Date();

  const value: Range = {
    type: id,
    from: subDays(todayDate, durationInfo.days),
    to: todayDate,
    label: durationInfo.name,
  };

  return value;
}

const durationPresets = [
  {
    name: "Last 7 Days",
    id: "last-7",
    days: 7,
  },
  {
    name: "Last 30 Days",
    id: "last-30",
    days: 30,
  },
  {
    name: "Last 60 Days",
    id: "last-60",
    days: 60,
  },
  {
    name: "Last 120 Days",
    id: "last-120",
    days: 120,
  },
] as const;

export type DurationId = (typeof durationPresets)[number]["id"];

export type Range = {
  type: DurationId | "custom";
  label?: string;
  from: Date;
  to: Date;
};
