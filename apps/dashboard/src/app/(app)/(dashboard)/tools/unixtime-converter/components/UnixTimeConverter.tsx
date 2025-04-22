"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatDistanceToNow,
  formatISO9075,
  formatRFC3339,
  formatRFC7231,
  fromUnixTime,
} from "date-fns";
import { useMemo, useState } from "react";

export function UnixTimeConverter() {
  const [unixTime, setUnixTime] = useState(() => {
    return Math.floor(Date.now() / 1000);
  });

  const { date, error } = useMemo(() => {
    if (Number.isNaN(unixTime) || !Number.isInteger(unixTime)) {
      return {
        error: "Invalid Unix Timestamp",
        date: null,
      };
    }

    const date = fromUnixTime(unixTime);

    if (!isValidDate(date)) {
      return {
        date: null,
        error: "Invalid Unix Timestamp",
      };
    }

    return {
      date,
      error: null,
    };
  }, [unixTime]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader className="mb-6 border-b">
          <CardTitle className="font-bold text-2xl">
            Unix Time Converter
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <Label htmlFor="unixTime">Enter Unix Timestamp</Label>
            <Input
              id="unixTime"
              type="number"
              value={unixTime}
              onChange={(e) => {
                setUnixTime(Number(e.target.value));
              }}
              placeholder="e.g., 1609459200"
              className="mt-1"
            />
            {error && (
              <p className="mt-2 text-destructive-text text-sm">{error}</p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <Label>Relative Time</Label>
              <p className="font-mono text-muted-foreground">
                {date
                  ? formatDistanceToNow(date, {
                      addSuffix: true,
                    })
                  : "---"}
              </p>
            </div>
            <div>
              <Label>Local Time</Label>
              <p className="font-mono text-muted-foreground">
                {date ? formatLocal(date) : "---"}
              </p>
            </div>
            <div>
              <Label>UTC Time</Label>
              <p className="font-mono text-muted-foreground">
                {date ? formatUTC(date) : "---"}
              </p>
            </div>

            <div>
              <Label>ISO 8601</Label>
              <p className="font-mono text-muted-foreground">
                {date ? formatISO8601(date) : "---"}
              </p>
            </div>

            <div>
              <Label>ISO 9075</Label>
              <p className="font-mono text-muted-foreground">
                {date ? formatISO9075(date) : "---"}
              </p>
            </div>
            <div>
              <Label>RFC 7231</Label>
              <p className="font-mono text-muted-foreground">
                {date ? formatRFC7231(date) : "---"}
              </p>
            </div>
            <div>
              <Label>RFC 3339</Label>
              <p className="font-mono text-muted-foreground">
                {date ? formatRFC3339(date) : "---"}
              </p>
            </div>
            <div>
              <Label>SQL Timestamp</Label>
              <p className="font-mono text-muted-foreground">
                {date ? formatSQL(date) : "---"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatLocal(date: Date): string {
  return date.toLocaleString();
}

function formatUTC(date: Date): string {
  return date.toUTCString();
}

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

function formatISO8601(date: Date): string {
  return date.toISOString();
}

function formatSQL(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}
