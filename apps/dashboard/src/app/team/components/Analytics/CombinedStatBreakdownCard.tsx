import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toUSD } from "utils/number";
import { Stat } from "./Stat";
import { StatBreakdown } from "./StatBreakdown";

type StatBreakdownConfig<K extends string> = {
  [key in K]: {
    label: string;
    data: {
      label: string;
      value: number;
      fill?: string;
      icon?: React.ReactNode;
    }[];
  };
};

export function CombinedStatBreakdownCard<T extends string>({
  title,
  config,
  activeKey,
  queryKey,
  aggregateFn = (data) => data.reduce((acc, curr) => acc + curr.value, 0),
  isCurrency = false,
  existingQueryParams,
}: {
  title?: string;
  config: StatBreakdownConfig<T>;
  activeKey: T;
  queryKey: string;
  aggregateFn?: (data: (typeof config)[T]["data"]) => number;
  isCurrency?: boolean;
  existingQueryParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Card className="max-md:rounded-none max-md:border-r-0 max-md:border-l-0">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        {title && (
          <div className="flex flex-1 flex-col justify-center gap-1 p-6">
            <CardTitle className="font-semibold text-lg">{title}</CardTitle>
          </div>
        )}
        <div className="max-md:no-scrollbar overflow-x-auto border-t">
          <div className="flex flex-nowrap">
            {Object.keys(config).map((breakdown) => {
              const key = breakdown as T;
              const { data, label } = config[key];
              return (
                <Link
                  href={{
                    query: {
                      ...existingQueryParams,
                      [queryKey]: key,
                    },
                  }}
                  prefetch
                  scroll={false}
                  key={breakdown}
                  data-active={activeKey === breakdown}
                  className="relative z-30 flex min-w-[200px] flex-1 flex-col justify-center gap-1 border-l first:border-l-0 hover:bg-card"
                >
                  <Stat
                    label={label}
                    value={
                      isCurrency ? toUSD(aggregateFn(data)) : aggregateFn(data)
                    }
                  />
                  <div
                    className="absolute right-0 bottom-0 left-0 h-0 bg-foreground transition-all duration-300 ease-out data-[active=true]:h-[3px]"
                    data-active={activeKey === breakdown}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <StatBreakdown data={config[activeKey].data} isCurrency={isCurrency} />
      </CardContent>
    </Card>
  );
}
