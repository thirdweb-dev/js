import { addDays, differenceInCalendarDays } from "date-fns";
import { simulateChartFetchingDelay } from "./delays";

export type TestData = Array<{ time: Date; count: number }>;

export async function fetchTestData(params: {
  from: Date;
  to: Date;
}) {
  await simulateChartFetchingDelay();

  const days = differenceInCalendarDays(params.to, params.from);

  const data: TestData = [];
  for (let i = 0; i < days; i++) {
    data.push({
      time: addDays(params.from, i),
      count: ((i + 1) % 10) + i,
    });
  }

  return data;
}
