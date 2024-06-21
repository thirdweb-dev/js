import { AspectRatio, type AspectRatioProps, Flex } from "@chakra-ui/react";
import { Suspense } from "react";
import type { ComponentWithChildren } from "types/component-with-children";
import { AreaChartLoadingState } from "./area-chart";

type SupportedChartType = "area";

interface ChartContainerProps extends AspectRatioProps {
  chartTitle?: JSX.Element;
  chartType?: SupportedChartType;
}

export const ChartContainer: ComponentWithChildren<ChartContainerProps> = ({
  chartType = "area",
  chartTitle,
  children,
  ...aspectRatioProps
}) => {
  return (
    <Flex direction="column">
      {chartTitle}
      <AspectRatio {...aspectRatioProps}>
        {/* suspense to handle loading state */}
        <Suspense fallback={<ChartLoadingState chartType={chartType} />}>
          {children}
        </Suspense>
      </AspectRatio>
    </Flex>
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
