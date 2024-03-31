import { CustomToolTip } from "./custom-tooltip";
import { Box, BoxProps, Center } from "@chakra-ui/react";
import { useEffect, useId, useState } from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Text } from "tw-components";

export type GenericDataType = Record<string, string | number>;

type IndexType = "date";

export interface AreaChartProps<
  TData extends GenericDataType,
  TIndexKey extends keyof TData,
> extends BoxProps {
  data: TData[];
  index: {
    id: TIndexKey;
    label?: string;
    type?: IndexType;
    format?: (index: TData[TIndexKey]) => string;
  };

  categories: Array<{
    id: keyof TData;
    label?: string;
    color?: string;
    format?: (value: number) => string;
  }>;
  showXAxis?: boolean;
  showYAxis?: boolean;
  startEndOnly?: boolean;
}

const AreaChart = <
  TData extends GenericDataType,
  TIndexKey extends keyof TData,
>({
  data,
  index,
  categories,
  showXAxis,
  showYAxis,
  startEndOnly,
  ...boxProps
}: AreaChartProps<TData, TIndexKey>) => {
  const id = useId();

  if (!data.length) {
    return null;
  }

  if (!index.type) {
    index.type = "date";
  }

  return (
    <Box h="full" w="full" {...boxProps}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data}>
          <defs>
            {categories.map((cat) => (
              <linearGradient
                key={`${cat.id as string}`}
                id={`area_color_${id}_${cat.id as string}`}
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="5%"
                  stopColor={cat.color || "#3385FF"}
                  stopOpacity={0.4}
                />
                <stop
                  offset="75%"
                  stopColor={cat.color || "#3385FF"}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>

          {categories.map((cat) => (
            <Area
              key={`${cat.id as string}`}
              type="natural"
              dataKey={cat.id as string}
              stroke={cat.color || "#3385FF"}
              fill={`url(#area_color_${id}_${cat.id as string})`}
              dot={false}
              activeDot={{
                strokeWidth: 0,
              }}
              strokeWidth={1.5}
            />
          ))}
          <Tooltip
            wrapperStyle={{ outline: "none" }}
            content={({ active, payload }) => {
              const payloadKey = payload?.[0]?.dataKey;
              const category = categories.find((cat) => cat.id === payloadKey);
              return (
                <CustomToolTip
                  active={active}
                  payload={payload}
                  valueLabel={category?.label || ""}
                  valueFormatter={category?.format}
                />
              );
            }}
            cursor={{
              stroke: "#3385FF",
              fill: "#3385FF",
              opacity: 0.3,
              strokeDasharray: 2,
              strokeWidth: 1.5,
            }}
          />

          <XAxis
            hide={!showXAxis}
            dataKey={index.id as string}
            tickFormatter={(payload) =>
              index.format
                ? index.format(payload)
                : index.type === "date"
                  ? new Date(payload).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : payload
            }
            style={{
              fontSize: "12px",
              fontFamily: "var(--chakra-fonts-body)",
            }}
            stroke="var(--chakra-colors-paragraph)"
            tickLine={false}
            axisLine={{ stroke: "var(--chakra-colors-borderColor)" }}
            interval="preserveStartEnd"
            minTickGap={5}
            domain={["dataMin", "dataMax"]}
            type="number"
            tick={{ transform: "translate(0, 6)" }}
            ticks={
              startEndOnly
                ? [data[0][index.id], data[data.length - 1][index.id]]
                : undefined
            }
          />

          <YAxis
            hide={!showYAxis}
            width={60}
            tickFormatter={(payload) => {
              const category = categories[0];
              return category?.format
                ? category.format(payload)
                : payload.toString();
            }}
            style={{
              fontSize: "12px",
              fontFamily: "var(--chakra-fonts-body)",
            }}
            domain={([dataMin, dataMax]) => [
              // start from 0 unless dataMin is below 0 in which case start from dataMin - 10%
              Math.min(0, dataMin - Math.round(dataMin * 0.1)),
              // add 10% to the top
              dataMax + Math.round(dataMax * 0.1),
            ]}
            tick={{ transform: "translate(-3, 0)" }}
            type="number"
            stroke="var(--chakra-colors-paragraph)"
            tickLine={false}
            axisLine={{ stroke: "var(--chakra-colors-borderColor)" }}
            interval="preserveStartEnd"
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

function randomNumber(min = 0, max = 100) {
  return Math.random() * (max - min) + min;
}

function generateFakeData() {
  const data = [];
  for (let i = 0; i < 7; i++) {
    data.push({
      key: i,
      value: randomNumber(i * 10, i * 10 + 30),
    });
  }
  return data;
}

export const AreaChartLoadingState: React.FC = () => {
  const [loadingData, setLoadingData] = useState(generateFakeData());
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingData(generateFakeData());
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  return (
    <Box position="relative">
      <Center
        backdropFilter="blur(4px)"
        zIndex={1}
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
      >
        <Text size="label.lg" color="faded">
          Loading Chart...
        </Text>
      </Center>
      <AreaChart
        pointerEvents="none"
        data={loadingData}
        index={{ id: "key" }}
        categories={[{ id: "value", color: "var(--chakra-colors-faded)" }]}
      />
    </Box>
  );
};
