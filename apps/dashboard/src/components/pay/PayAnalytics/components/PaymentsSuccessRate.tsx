import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { SkeletonContainer } from "../../../../@/components/ui/skeleton";
import { ToolTipLabel } from "../../../../@/components/ui/tooltip";
import { usePayVolume } from "../hooks/usePayVolume";
import { CardHeading, NoDataAvailable } from "./common";

type PayVolumeType = "all" | "crypto" | "fiat";

type UIData = {
  succeeded: number;
  failed: number;
  rate: number;
  total: number;
};

function getUIData(
  volumeQuery: ReturnType<typeof usePayVolume>,
  type: PayVolumeType,
): {
  data?: UIData;
  isError?: boolean;
  isLoading?: boolean;
} {
  if (volumeQuery.isLoading) {
    return { isLoading: true };
  }

  if (volumeQuery.isError) {
    return { isError: true };
  }

  const aggregated = volumeQuery.data.aggregate;

  let succeeded = 0;
  let failed = 0;

  switch (type) {
    case "all": {
      succeeded = aggregated.sum.succeeded.count;
      failed = aggregated.sum.failed.count;
      break;
    }

    case "crypto": {
      succeeded = aggregated.buyWithCrypto.succeeded.count;
      failed = aggregated.buyWithCrypto.failed.count;
      break;
    }

    case "fiat": {
      succeeded = aggregated.buyWithFiat.succeeded.count;
      failed = aggregated.buyWithFiat.failed.count;
      break;
    }

    default: {
      throw new Error("Invalid tab");
    }
  }

  const total = succeeded + failed;

  if (total === 0) {
    return {
      isError: true,
    };
  }

  const rate = (succeeded / (succeeded + failed)) * 100;
  const data = { succeeded, failed, rate, total };

  return { data };
}

export function PaymentsSuccessRate(props: {
  clientId: string;
  from: Date;
  to: Date;
}) {
  const [type, setType] = useState<PayVolumeType>("all");
  const volumeQuery = usePayVolume({
    clientId: props.clientId,
    from: props.from,
    to: props.to,
    intervalType: "day",
  });

  const uiData = getUIData(volumeQuery, type);

  return (
    <div className="w-full relative flex flex-col">
      <div className="flex justify-between gap-2 items-center">
        <CardHeading> Payments </CardHeading>
        {uiData.data && (
          <Select
            value={type}
            onValueChange={(value: PayVolumeType) => {
              setType(value);
            }}
          >
            <SelectTrigger className="bg-transparent w-auto">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="all">Total</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
              <SelectItem value="fiat">Fiat</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {!uiData.isError ? (
          <RenderData data={uiData.data} />
        ) : (
          <NoDataAvailable />
        )}
      </div>
    </div>
  );
}

function RenderData(props: { data?: UIData }) {
  return (
    <div>
      <div className="h-10" />
      <SkeletonContainer
        loadedData={props.data?.rate}
        skeletonData={50}
        render={(rate) => <Bar rate={rate} />}
      />

      <div className="h-6" />

      <InfoRow
        label="Succeeded"
        type="success"
        amount={props.data?.succeeded}
      />

      <div className="h-3" />

      <InfoRow label="Failed" type="failure" amount={props.data?.failed} />
    </div>
  );
}

function Bar(props: { rate: number }) {
  return (
    <div className="flex items-center gap-0.5">
      <ToolTipLabel label="Succeeded">
        <div
          className="h-5 bg-success-foreground transition-all rounded-lg rounded-r-none border-r-0"
          style={{
            width: `${props.rate}%`,
          }}
        />
      </ToolTipLabel>
      <ToolTipLabel label="Failed">
        <div className="h-5 bg-destructive-foreground flex-1 transition-all rounded-lg rounded-l-none border-l-0" />
      </ToolTipLabel>
    </div>
  );
}

function InfoRow(props: {
  label: string;
  type: "success" | "failure";
  amount?: number;
}) {
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div
          className={`size-5 rounded-lg ${
            props.type === "success"
              ? "bg-success-foreground"
              : "bg-destructive-foreground"
          }`}
        />
        <p className="text-base text-secondary-foreground">{props.label}</p>
      </div>
      <SkeletonContainer
        loadedData={props.amount}
        skeletonData={50}
        render={(v) => {
          return <p className="text-base font-medium">${v.toLocaleString()}</p>;
        }}
      />
    </div>
  );
}
