import { CustomToolTip } from "./custom-tooltip";
import { Box, BoxProps, useColorMode } from "@chakra-ui/react";
import { useId, useMemo } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type GenericDataType = Record<string, string | number>;

type IndexType = "date";

export interface BarChartProps<
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
}

export const BarChart = <
  TData extends GenericDataType,
  TIndexKey extends keyof TData,
>({
  data,
  index,
  categories,
  showXAxis,
  showYAxis,
  ...boxProps
}: BarChartProps<TData, TIndexKey>) => {
  const { colorMode } = useColorMode();
  const id = useId();

  const defaultBarColor = useMemo(() => {
    if (colorMode === "light") {
      return "#649CDD";
    }

    return "#3682DA";
  }, [colorMode]);

  if (!data.length) {
    return null;
  }

  if (!index.type) {
    index.type = "date";
  }

  return (
    <Box {...boxProps}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <defs>
            {categories.map((cat) => (
              <linearGradient
                key={`${cat.id as string}`}
                id={`bar_color_${id}_${cat.id as string}`}
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0"
                  stopColor={cat.color || defaultBarColor}
                  stopOpacity={1}
                />
                <stop
                  offset="1"
                  stopColor={cat.color || defaultBarColor}
                  stopOpacity={0.75}
                />
              </linearGradient>
            ))}
          </defs>

          {categories.map((cat) => (
            <Bar
              key={`${cat.id as string}`}
              dataKey={cat.id as string}
              stackId="a"
              stroke={cat.color || defaultBarColor}
              fill={`url(#bar_color_${id}_${cat.id as string})`}
              strokeWidth={0}
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
              stroke: defaultBarColor,
              fill: defaultBarColor,
              opacity: 0.2,
              strokeDasharray: 2,
              strokeWidth: 0,
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
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })
                  : payload
            }
            style={{
              fontSize: "12px",
              fontFamily: "var(--chakra-fonts-body)",
            }}
            stroke="var(--chakra-colors-paragraph)"
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={5}
            domain={["dataMin - 86400000", "dataMax + 86400000"]}
            type="number"
            tick={{ transform: "translate(0, 6)" }}
            ticks={[
              data[0][index.id],
              data[Math.floor(data.length / 2)][index.id],
              data[data.length - 1][index.id],
            ]}
          />

          <YAxis
            hide={!showYAxis}
            width={60}
            tickFormatter={(payload) => {
              const category = categories[0];
              return category?.format
                ? category.format(payload)
                : payload.toLocaleString();
            }}
            style={{
              fontSize: "12px",
              fontFamily: "var(--chakra-fonts-body)",
            }}
            type="number"
            stroke="var(--chakra-colors-paragraph)"
            tickLine={false}
            axisLine={false}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </Box>
  );
};
