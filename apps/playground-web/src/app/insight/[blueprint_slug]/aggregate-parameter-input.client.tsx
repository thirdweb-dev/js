"use client";

import { InfoIcon, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

interface Preset {
  id: string;
  label: string;
  value: string;
}

const DEFAULT_AGGREGATE_PRESETS: Preset[] = [
  {
    id: "count-all",
    label: "Count All Items",
    value: "count() AS count_all",
  },
  {
    id: "sum-gas",
    label: "Sum (gas_used)",
    value: "sum(gas_used) AS total_gas_used",
  },
  {
    id: "avg-gas",
    label: "Average (gas_used)",
    value: "avg(gas_used) AS avg_gas_used",
  },
  {
    id: "min-gas",
    label: "Min (gas_used)",
    value: "min(gas_used) AS min_gas_used",
  },
  {
    id: "max-gas",
    label: "Max (gas_used)",
    value: "max(gas_used) AS max_gas_used",
  },
  {
    id: "count-distinct",
    label: "Count Distinct",
    value: "countDistinct(column_name) AS unique_count",
  },
];

const GENERAL_TRANSACTIONS_PRESETS: Preset[] = [
  {
    id: "tx-count",
    label: "Transaction Count",
    value: "count() AS transaction_count",
  },
  {
    id: "total-value",
    label: "Total Value (Wei)",
    value: "sum(value) AS total_value_wei",
  },
  {
    id: "total-gas",
    label: "Total Gas Used",
    value: "sum(gas_used) AS total_gas_used",
  },
  {
    id: "avg-value",
    label: "Avg Value (Wei)",
    value: "avg(value) AS avg_value_wei",
  },
  {
    id: "avg-gas",
    label: "Avg Gas Used",
    value: "avg(gas_used) AS avg_gas_used",
  },
  {
    id: "unique-senders",
    label: "Unique Senders",
    value: "countDistinct(from_address) AS unique_senders",
  },
  {
    id: "unique-receivers",
    label: "Unique Receivers",
    value: "countDistinct(to_address) AS unique_receivers",
  },
];

const WALLET_TRANSACTIONS_PRESETS: Preset[] = [
  {
    id: "wallet-tx-count",
    label: "Transaction Count",
    value: "count() AS transaction_count",
  },
  {
    id: "wallet-total-value",
    label: "Total Value (Wei)",
    value: "sum(value) AS total_value_wei",
  },
  {
    id: "wallet-avg-value",
    label: "Avg Value (Wei)",
    value: "avg(value) AS avg_value_wei",
  },
  {
    id: "wallet-total-fees",
    label: "Total Fees (Wei)",
    value: "sum(gas_used * gas_price) AS total_fees_wei",
  },
];

const EVENTS_PRESETS: Preset[] = [
  {
    id: "event-count",
    label: "Event Count",
    value: "count() AS event_count",
  },
  {
    id: "unique-addresses",
    label: "Unique Addresses",
    value: "countDistinct(address) AS unique_addresses",
  },
  {
    id: "min-block",
    label: "Min Block Number",
    value: "min(block_number) AS min_block",
  },
  {
    id: "max-block",
    label: "Max Block Number",
    value: "max(block_number) AS max_block",
  },
  {
    id: "unique-topics",
    label: "Unique Topics",
    value: "countDistinct(topic0) AS unique_topics",
  },
];

const BLOCKS_PRESETS: Preset[] = [
  {
    id: "block-count",
    label: "Block Count",
    value: "count() AS block_count",
  },
  {
    id: "total-transactions",
    label: "Total Transactions",
    value: "sum(transaction_count) AS total_transactions",
  },
  {
    id: "avg-transactions",
    label: "Avg Transactions/Block",
    value: "avg(transaction_count) AS avg_transactions_per_block",
  },
  {
    id: "total-gas-used",
    label: "Total Gas Used",
    value: "sum(gas_used) AS total_gas_used",
  },
  {
    id: "min-block-number",
    label: "Min Block Number",
    value: "min(number) AS min_block_number",
  },
  {
    id: "max-block-number",
    label: "Max Block Number",
    value: "max(number) AS max_block_number",
  },
];

const ENDPOINT_SPECIFIC_PRESETS: Record<string, Preset[]> = {
  "/v1/blocks": BLOCKS_PRESETS,
  "/v1/events": EVENTS_PRESETS,
  "/v1/transactions": GENERAL_TRANSACTIONS_PRESETS,
  "/v1/wallets/{wallet_address}/transactions": WALLET_TRANSACTIONS_PRESETS,
  // Add more endpoint paths and their specific presets here
};

function getAggregatePresets(endpointPath: string): Preset[] {
  return ENDPOINT_SPECIFIC_PRESETS[endpointPath] || DEFAULT_AGGREGATE_PRESETS;
}

interface AggregateParameterInputProps {
  field: ControllerRenderProps<{ [x: string]: string | number }, string>;
  showTip?: boolean;
  hasError?: boolean;
  placeholder?: string;
  endpointPath: string;
}

export function AggregateParameterInput({
  field,
  placeholder = "Enter aggregation query...",
  endpointPath,
  showTip = true,
}: AggregateParameterInputProps) {
  const { value, onChange } = field;
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const presets = useMemo(
    () => getAggregatePresets(endpointPath),
    [endpointPath],
  );

  const selectedValues = useMemo(() => {
    if (!value) return [];
    return String(value)
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }, [value]);

  const filteredPresets = useMemo(() => {
    if (!searchTerm) return presets;
    const query = searchTerm.toLowerCase();
    return presets.filter(
      (preset) =>
        preset.label.toLowerCase().includes(query) ||
        preset.value.toLowerCase().includes(query),
    );
  }, [presets, searchTerm]);

  const selectedPresets = useMemo(() => {
    return presets
      .filter((preset) => selectedValues.includes(preset.value.trim()))
      .map((preset) => preset.id);
  }, [presets, selectedValues]);

  const handlePresetToggle = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;

    const isSelected = selectedValues.includes(preset.value.trim());
    let newValues: string[];

    if (isSelected) {
      newValues = selectedValues.filter((v) => v !== preset.value.trim());
    } else {
      newValues = [...selectedValues, preset.value.trim()];
    }

    onChange({ target: { value: newValues.join(",") } });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ target: { value: e.target.value } });
  };

  const getButtonText = () => {
    if (selectedValues.length === 0) return "aggregate";
    if (selectedValues.length === 1)
      return `${selectedValues.length} aggregation added`;
    return `${selectedValues.length} aggregations added`;
  };

  return (
    <div className="relative w-full">
      <Popover onOpenChange={setIsPopoverOpen} open={isPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            className="-ml-1 w-full justify-start border-0 border-none bg-transparent font-mono text-muted-foreground shadow-none hover:bg-transparent hover:text-muted-foreground focus:ring-0 focus:ring-offset-0"
            variant="ghost"
          >
            <span className="truncate">{getButtonText()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          className="w-[calc(100vw-2rem)] p-0 sm:w-[32rem]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                {showTip && (
                  <div className="ml-auto flex items-center text-muted-foreground text-xs">
                    <InfoIcon className="mr-1.5 h-3.5 w-3.5" />
                    <span>Separate multiple with commas</span>
                  </div>
                )}
              </div>
              <Textarea
                className="min-h-[100px] font-mono text-sm"
                onChange={handleTextareaChange}
                placeholder={placeholder}
                spellCheck={false}
                value={(value as string) || ""}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="relative w-full">
                  <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="h-8 pl-8 text-sm"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search presets..."
                    type="search"
                    value={searchTerm}
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto rounded-md border">
                {filteredPresets.length > 0 ? (
                  <div className="divide-y">
                    {filteredPresets.map((preset) => (
                      <div className="p-3 hover:bg-accent/50" key={preset.id}>
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={selectedPresets.includes(preset.id)}
                            className="mt-1 h-4 w-4 rounded"
                            id={preset.id}
                            onCheckedChange={() =>
                              handlePresetToggle(preset.id)
                            }
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center">
                              <Label
                                className="cursor-pointer font-medium text-sm leading-none"
                                htmlFor={preset.id}
                              >
                                {preset.label}
                              </Label>
                            </div>
                            <div className="flex justify-between">
                              <code className="break-all font-mono text-muted-foreground text-xs">
                                {preset.value}
                              </code>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No presets found. Try a different search term.
                  </div>
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
