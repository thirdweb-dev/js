import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import type { ComponentWithChildren } from "types/component-with-children";
import { AreaChartLoadingState } from "./area-chart";

type SupportedChartType = "area";

interface ChartContainerProps {
  chartTitle?: JSX.Element;
  chartType?: SupportedChartType;
  ratio: number;
  className?: string;
}

export const ChartContainer: ComponentWithChildren<ChartContainerProps> = ({
  chartType = "area",
  chartTitle,
  ratio,
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col", className)}>
      {chartTitle}
      <AspectRatio ratio={ratio}>
        {/* suspense to handle loading state */}
        <Suspense fallback={<ChartLoadingState chartType={chartType} />}>
          {children}
        </Suspense>
      </AspectRatio>
    </div>
  );
};

const ChartLoadingState: React.FC<Pick<ChartContainerProps, "chartType">> = ({
  chartType,
}) => {
  if (chartType === "area") {
    return <AreaChartLoadingState />;
  }
  return null;
};
