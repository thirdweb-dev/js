import type { Project } from "@/api/projects";
import type { Range } from "components/analytics/date-range-selector";
import { RangeSelector } from "components/analytics/range-selector";

export function ProjectOverviewHeader(props: {
  project: Project;
  interval: "day" | "week";
  range: Range;
}) {
  const { project, interval, range } = props;

  return (
    <div className="container flex flex-col items-start gap-6 px-2 py-6 md:h-[120px] md:flex-row md:items-center md:p-6 md:py-0">
      <div className="flex-1">
        <h1 className="font-semibold text-3xl text-foreground">
          {project.name}
        </h1>
      </div>
      <RangeSelector interval={interval} range={range} />
    </div>
  );
}
