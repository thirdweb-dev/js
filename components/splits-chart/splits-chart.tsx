import { SplitInitializer } from "@thirdweb-dev/sdk";
import React, { useMemo, useState } from "react";
import { Hint, RadialChart, RadialChartPoint } from "react-vis";
import { Card, Text } from "tw-components";
import { z } from "zod";

interface SplitsPieChartProps {
  recipients: z.infer<
    typeof SplitInitializer["schema"]["output"]
  >["recipients"];
}

export const SplitsPieChart: React.FC<SplitsPieChartProps> = ({
  recipients,
}) => {
  const [hoverValue, setHoverValue] = useState<RadialChartPoint>();

  const totalShares = recipients.reduce((acc, cur) => {
    return acc + cur.sharesBps;
  }, 0);

  const offsetToFull = totalShares - 10_000;

  const finalSlices = useMemo(() => {
    let slices: {
      address: string;
      sharesBps: number;
      _isFiller?: true;
    }[] = recipients;

    slices = slices.concat({
      address: "",
      sharesBps: offsetToFull < 0 ? Math.abs(offsetToFull) : 0,
      _isFiller: true,
    });

    return slices;
  }, [offsetToFull, recipients]);

  return (
    <RadialChart
      data={finalSlices.map((slice) => ({
        shares: slice.sharesBps,
        angle: slice.sharesBps,
        label: slice.address,
        _isFiller: slice._isFiller,
        style: slice._isFiller
          ? { fill: "rgba(0,0,0,.1)", stroke: "transparent" }
          : undefined,
      }))}
      width={300}
      height={300}
      innerRadius={100}
      radius={140}
      animation
      onValueMouseOver={(value) => setHoverValue(value)}
      onSeriesMouseOut={() => setHoverValue(undefined)}
    >
      {hoverValue && !hoverValue._isFiller && (
        <Hint
          align={{ horizontal: "auto", vertical: "auto" }}
          value={hoverValue}
        >
          <Card>
            <Text size="label.md">{hoverValue.label || "N/A"}</Text>
            <Text>{hoverValue.shares / 100}%</Text>
          </Card>
        </Hint>
      )}
    </RadialChart>
  );
};
