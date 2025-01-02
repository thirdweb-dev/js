"use client";

import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { ShareButton } from "../../components/share";

export const UnixTimeConverter = () => {
  const getCurrentUnixMilliseconds = () => Math.floor(new Date().getTime());
  const [unix, setUnix] = useState<number>(getCurrentUnixMilliseconds());

  // `unix` may be in milliseconds or seconds.
  // Treat any value < 100000000000 as seconds, otherwise milliseconds.
  const isSeconds = unix < 100000000000;
  const date = new Date(isSeconds ? unix * 1000 : unix);
  const dateLocal = date.toLocaleString(undefined, {
    timeZoneName: "short",
  });
  const dateUTC = date.toLocaleString(undefined, {
    timeZoneName: "short",
    timeZone: "UTC",
  });

  return (
    <div className="space-y-24">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label htmlFor="unix-input" className="min-w-64 text-xl">
            Unix Time
          </Label>
          <Input
            id="unix-input"
            type="number"
            value={unix}
            onChange={(e) => {
              if (!Number.isNaN(e.target.valueAsNumber)) {
                setUnix(e.target.valueAsNumber);
              }
            }}
            placeholder="Enter a Unix time in milliseconds or seconds"
            className="p-6 text-xl"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label className="min-w-64 text-xl">Time (local)</Label>
          <div>
            <CopyTextButton
              textToCopy={dateLocal}
              textToShow={dateLocal}
              tooltip="Copy"
              copyIconPosition="right"
              className="font-mono text-xl"
            />
          </div>
          <p className="text-sm italic">
            &larr; {formatDistanceToNow(date, { addSuffix: true })}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label className="min-w-64 text-xl">Time (UTC)</Label>
          <div>
            <CopyTextButton
              textToCopy={dateUTC}
              textToShow={dateUTC}
              tooltip="Copy"
              copyIconPosition="right"
              className="font-mono text-xl"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <ShareButton
            cta="Share on X"
            href="https://twitter.com/intent/tweet?text=Easy-to-use%20Unix%20time%20converter%20by%20thirdweb%20%F0%9F%98%8D&url=https%3A%2F%2Fthirdweb.com%2Ftools%2Funixtime-converter"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="font-bold text-2xl">
          Convert Unix time in milliseconds or seconds
        </h1>

        <p>
          Timestamps are often represented in Unix time for several key reasons:
        </p>
        <h2 className="font-bold text-md">Simplicity</h2>
        <p>
          Counts seconds since January 1, 1970, making it easy to understand and
          manipulate.
        </p>
        <h2 className="font-bold text-md">Consistency</h2>
        <p>
          Provides a uniform time representation across systems, unaffected by
          time zones or calendar changes.
        </p>
        <h2 className="font-bold text-md">Standardization</h2>
        <p>
          Widely supported in computing, ensuring compatibility across
          platforms.
        </p>
        <h2 className="font-bold text-md">Calculation</h2>
        <p>
          Allows straightforward arithmetic operations for time differences.
        </p>
        <h2 className="font-bold text-md">Efficiency</h2>
        <p>
          Stores time as a single integer, conserving memory and computational
          resources.
        </p>
        <h2 className="font-bold text-md">Interoperability</h2>
        <p>Facilitates seamless data exchange between systems and languages.</p>
      </div>
    </div>
  );
};
