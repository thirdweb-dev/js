import { StackToolTip } from "./stack-tooltip";
import { Box, BoxProps, useColorMode } from "@chakra-ui/react";
import { useId, useMemo, useState } from "react";
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

interface AutoBarChartProps<
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
  showXAxis?: boolean;
  showYAxis?: boolean;
  stacked?: boolean;
}

export const BAR_COLORS_LIGHT = [
  "#649CDD",
  "#92BBE8",
  "#407DCC",
  "#94BD5D",
  "#729544",
  "#A48AC1",
  "#C5B5D7",
  "#8460AB",
  "#E1918E",
  "#D65E59",
  "#F3D570",
  "#F7E5A2",
  "#EFC64A",
  "#E7AB78",
  "#F0CDAD",
  "#DF8A47",
  "#A6D7D8",
  "#CEE9E9",
];

export const BAR_COLORS_DARK = [
  "#3682DA",
  "#6AADF5",
  "#1769D3",
  "#84BF35",
  "#629421",
  "#8751C3",
  "#AA85D3",
  "#6E38A9",
  "#DE6F6B",
  "#D43932",
  "#FACD38",
  "#FFE689",
  "#F0BF2A",
  "#E4934E",
  "#F4C294",
  "#DE7929",
  "#7CDEE0",
  "#C8FFFF",
];

export const AutoBarChart = <
  TData extends GenericDataType,
  TIndexKey extends keyof TData,
>({
  data,
  index,
  showXAxis,
  showYAxis,
  stacked,
  ...boxProps
}: AutoBarChartProps<TData, TIndexKey>) => {
  const { colorMode } = useColorMode();
  const [hoverKey, setHoverKey] = useState("");
  const id = useId();

  const barColors = useMemo(() => {
    if (colorMode === "light") {
      return BAR_COLORS_LIGHT;
    }

    return BAR_COLORS_DARK;
  }, [colorMode]);

  const categories = useMemo(() => {
    const autoKeys: string[] = [];
    data.forEach((item) => {
      for (const key of Object.keys(item)) {
        if (key === index.id) {
          continue;
        }

        if (!autoKeys.includes(key)) {
          autoKeys.push(key);
        }
      }
    });

    return autoKeys.map((key, idx) => ({
      id: key,
      label: key,
      color: barColors[idx % barColors.length],
    }));
  }, [data, index.id, barColors]);

  if (!index.type) {
    index.type = "date";
  }

  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) => (a[index.id] as number) - (b[index.id] as number),
    );
  }, [data, index]);

  if (!data.length) {
    return null;
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
                  stopColor={cat.color || "#3385FF"}
                  stopOpacity={1}
                />
                <stop
                  offset="1"
                  stopColor={cat.color || "#3385FF"}
                  stopOpacity={0.75}
                />
              </linearGradient>
            ))}
          </defs>

          {categories.map((cat) => (
            <Bar
              key={`${cat.id as string}`}
              dataKey={cat.id as string}
              stackId={stacked ? "a" : (cat.id as string)}
              stroke={cat.color || "#3385FF"}
              fill={`url(#bar_color_${id}_${cat.id as string})`}
              opacity={cat.id === hoverKey || !hoverKey ? 1 : 0.5}
              strokeWidth={0}
              onMouseOver={(item) => {
                setHoverKey(item.tooltipPayload[0].dataKey);
              }}
              onMouseLeave={() => {
                setHoverKey("");
              }}
            />
          ))}
          <Tooltip
            wrapperStyle={{ outline: "none" }}
            content={({ active, payload }) => {
              if (!active || !payload) {
                return null;
              }

              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { time, ...values } = payload[0].payload;
              return (
                <StackToolTip
                  time={payload[0]?.payload?.time}
                  values={values}
                  hoverKey={hoverKey}
                />
              );
            }}
            cursor={
              !hoverKey || categories.length <= 1
                ? {
                    stroke: "#EAEAEA",
                    fill: "#EAEAEA",
                    opacity: 0.3,
                    strokeDasharray: 2,
                    strokeWidth: 0,
                  }
                : false
            }
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
              sortedData[0][index.id],
              sortedData[Math.floor(sortedData.length / 2)][index.id],
              sortedData[sortedData.length - 1][index.id],
            ]}
          />

          <YAxis
            hide={!showYAxis}
            width={60}
            tickFormatter={(payload) => {
              return payload.toLocaleString();
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
