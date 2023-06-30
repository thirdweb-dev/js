import { AreaChartErrorState, AreaChartLoadingState } from "./area-chart";
import { AspectRatio, AspectRatioProps, Flex } from "@chakra-ui/react";
import { ErrorBoundary } from "@sentry/nextjs";
import { Suspense } from "react";
import { ComponentWithChildren } from "types/component-with-children";

export type SupportedChartType = "area";

export interface ChartContainerProps extends AspectRatioProps {
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

export interface ChartErrorStateProps
  extends Pick<ChartContainerProps, "chartType"> {
  resetError: () => void;
}

const ChartErrorState: React.FC<ChartErrorStateProps> = ({
  chartType,
  resetError,
}) => {
  if (chartType === "area") {
    return <AreaChartErrorState resetError={resetError} />;
  }
  return null;
};
