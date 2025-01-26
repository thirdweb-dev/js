"use client";

import { createContext, useContext, useState } from "react";
import invariant from "tiny-invariant";
import type { Range } from "../../../../../../../components/analytics/date-range-selector";

type SetRange = (range: Range) => void;

// eslint-disable-next-line no-restricted-syntax
const RangeCtx = createContext<Range | null>(null);
// eslint-disable-next-line no-restricted-syntax
const SetRangeCtx = createContext<SetRange | null>(null);

export function RangeProvider(props: {
  value: Range;
  children: React.ReactNode;
}) {
  const [range, setRange] = useState<Range>(props.value);

  return (
    <RangeCtx.Provider value={range}>
      <SetRangeCtx.Provider value={setRange}>
        {props.children}
      </SetRangeCtx.Provider>
    </RangeCtx.Provider>
  );
}

export function useRange() {
  const range = useContext(RangeCtx);
  invariant(range, "Not in RangeProvider");
  return range;
}

export function useSetRange() {
  const setRange = useContext(SetRangeCtx);
  invariant(setRange, "Not in RangeProvider");
  return setRange;
}
