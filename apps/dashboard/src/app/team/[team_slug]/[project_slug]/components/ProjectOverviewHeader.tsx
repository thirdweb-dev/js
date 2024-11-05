import type { Project } from "@/api/projects";
import { RangeSelector } from "components/analytics/range-selector";

export function ProjectOverviewHeader(props: {
  project: Project;
}) {
  const { project } = props;

  return (
    <div className="flex flex-col items-start gap-6 py-6 md:h-[120px] md:flex-row md:items-center md:py-0">
      <div className="flex-1">
        <h1 className="font-semibold text-3xl text-foreground">
          {project.name}
        </h1>
      </div>
      <RangeSelector interval="day" />
    </div>
  );
}
