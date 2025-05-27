"use client";

import { MultiSelect } from "@/components/blocks/multi-select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";

interface Preset {
  label: string;
  value: string;
}

const DEFAULT_AGGREGATE_PRESETS: Preset[] = [
  { label: "Count All Items", value: "count() AS count_all" },
  { label: "Sum (gas_used)", value: "sum(gas_used) AS total_gas_used" },
  { label: "Average (gas_used)", value: "avg(gas_used) AS avg_gas_used" },
  { label: "Min (gas_used)", value: "min(gas_used) AS min_gas_used" },
  { label: "Max (gas_used)", value: "max(gas_used) AS max_gas_used" },
  // Presets for a user-defined field
  {
    label: "Count (custom field)",
    value: "count(your_field_here) AS count_custom",
  },
  { label: "Sum (custom field)", value: "sum(your_field_here) AS sum_custom" },
  {
    label: "Average (custom field)",
    value: "avg(your_field_here) AS avg_custom",
  },
  { label: "Min (custom field)", value: "min(your_field_here) AS min_custom" },
  { label: "Max (custom field)", value: "max(your_field_here) AS max_custom" },
];

const GENERAL_TRANSACTIONS_PRESETS: Preset[] = [
  { label: "Transaction Count", value: "count() AS transaction_count" },
  {
    label: "Total Value Transferred (Wei)",
    value: "sum(value) AS total_value_wei",
  },
  { label: "Total Gas Used", value: "sum(gas_used) AS total_gas_used" },
  {
    label: "Average Value Transferred (Wei)",
    value: "avg(value) AS average_value_wei",
  },
  { label: "Average Gas Used", value: "avg(gas_used) AS average_gas_used" },
  {
    label: "Max Value Transferred (Wei)",
    value: "max(value) AS max_value_wei",
  },
  { label: "Max Gas Used", value: "max(gas_used) AS max_gas_used" },
  {
    label: "Min Value Transferred (Wei)",
    value: "min(value) AS min_value_wei",
  },
  { label: "Min Gas Used", value: "min(gas_used) AS min_gas_used" },
];

const WALLET_TRANSACTIONS_PRESETS: Preset[] = [
  { label: "Wallet Transaction Count", value: "count() AS wallet_tx_count" },
  {
    label: "Wallet Total Value (Wei)",
    value: "sum(value) AS wallet_total_value_wei",
  },
  {
    label: "Wallet Total Gas Spent",
    value: "sum(gas_used) AS wallet_total_gas_spent",
  },
  {
    label: "Wallet Average Value (Wei)",
    value: "avg(value) AS wallet_avg_value",
  },
  {
    label: "Wallet Average Gas Spent",
    value: "avg(gas_used) AS wallet_avg_gas_spent",
  },
  {
    label: "Wallet Max Value Tx (Wei)",
    value: "max(value) AS wallet_max_value_tx",
  },
  { label: "Wallet Max Gas Tx", value: "max(gas_used) AS wallet_max_gas_tx" },
  {
    label: "Wallet Min Value Tx (Wei)",
    value: "min(value) AS wallet_min_value_tx",
  },
  { label: "Wallet Min Gas Tx", value: "min(gas_used) AS wallet_min_gas_tx" },
];

const EVENTS_PRESETS: Preset[] = [
  { label: "Event Count", value: "count() AS event_count" },
  {
    label: "Unique Addresses",
    value: "countDistinct(address) AS unique_addresses",
  },
  { label: "Min Block Number", value: "min(block_number) AS min_block" },
  { label: "Max Block Number", value: "max(block_number) AS max_block" },
];

const BLOCKS_PRESETS: Preset[] = [
  { label: "Block Count", value: "count() AS block_count" },
  { label: "Min Block Number", value: "min(block_number) AS min_block_number" },
  { label: "Max Block Number", value: "max(block_number) AS max_block_number" },
  { label: "Total Gas Used", value: "sum(gas_used) AS total_gas_used" },
  { label: "Average Gas Used", value: "avg(gas_used) AS avg_gas_used" },
  { label: "Max Gas Used", value: "max(gas_used) AS max_gas_used" },
  { label: "Min Gas Used", value: "min(gas_used) AS min_gas_used" },
  {
    label: "Total Transactions",
    value: "sum(transaction_count) AS total_transactions",
  },
  {
    label: "Average Transactions per Block",
    value: "avg(transaction_count) AS avg_txs_per_block",
  },
  {
    label: "Max Transactions in a Block",
    value: "max(transaction_count) AS max_txs_in_block",
  },
  {
    label: "Min Transactions in a Block",
    value: "min(transaction_count) AS min_txs_in_block",
  },
];

const ENDPOINT_SPECIFIC_PRESETS: Record<string, Preset[]> = {
  "/v1/transactions": GENERAL_TRANSACTIONS_PRESETS,
  "/v1/wallets/{wallet_address}/transactions": WALLET_TRANSACTIONS_PRESETS,
  "/v1/events": EVENTS_PRESETS,
  "/v1/blocks": BLOCKS_PRESETS,
  // Add more endpoint paths and their specific presets here
};

function getAggregatePresets(endpointPath: string): Preset[] {
  return ENDPOINT_SPECIFIC_PRESETS[endpointPath] || DEFAULT_AGGREGATE_PRESETS;
}

interface AggregateParameterInputProps {
  field: ControllerRenderProps<
    {
      [x: string]: string | number;
    },
    string
  >;
  showTip?: boolean;
  hasError?: boolean;
  placeholder?: string;
  endpointPath: string;
}

export function AggregateParameterInput(props: AggregateParameterInputProps) {
  const { field, placeholder, endpointPath, showTip } = props;
  const { value, onChange } = field;

  const presets = useMemo(
    () => getAggregatePresets(endpointPath),
    [endpointPath],
  );

  const selectedValues = useMemo(() => {
    if (!value) return [];
    return String(value).split(",").filter(Boolean);
  }, [value]);

  const handlePresetChange = useCallback(
    (values: string[]) => {
      onChange({ target: { value: values.join(",") } });
    },
    [onChange],
  );

  // Custom search function for the MultiSelect
  const searchFunction = useCallback(
    (option: { value: string; label: string }, searchTerm: string) => {
      if (!searchTerm) return true;
      const query = searchTerm.toLowerCase();
      return (
        option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query)
      );
    },
    [],
  );

  // Get display values for the selected items
  useCallback(
    (value: string) => {
      const preset = presets.find((p) => p.value === value);
      return preset ? preset.label : value;
    },
    [presets],
  );

  // Format selected values for display in the MultiSelect
  useMemo(() => {
    return selectedValues.map((value) => {
      const preset = presets.find((p) => p.value === value);
      return {
        label: preset?.label || value,
        value,
      };
    });
  }, [selectedValues, presets]);

  // State for the manual input text
  const [manualInput, setManualInput] = useState("");

  // Update manual input when selected values change
  useEffect(() => {
    if (selectedValues.length === 0) {
      setManualInput("");
    } else {
      setManualInput(selectedValues.join(", "));
    }
  }, [selectedValues]);

  // Handle manual input changes
  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManualInput(value);

    // Update selected values by splitting on commas and trimming whitespace
    const newValues = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    onChange({ target: { value: newValues.join(",") } });
  };

  return (
    <div className="w-full">
      {/* Editable formula text field */}
      <div className="relative">
        <Input
          value={manualInput}
          onChange={handleManualInputChange}
          placeholder={placeholder}
          className={cn(
            "h-auto truncate rounded-none border-0 bg-transparent py-3 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0",
            showTip && "lg:pr-10",
          )}
        />
      </div>

      {/* MultiSelect for choosing aggregations */}
      <MultiSelect
        options={presets}
        selectedValues={selectedValues}
        onSelectedValuesChange={handlePresetChange}
        placeholder="Select presets (optional)"
        searchPlaceholder="Search aggregation presets"
        className={cn(
          "rounded-none border-0 border-border border-t-2 border-dashed",
          "hover:bg-inherit",
        )}
        popoverContentClassName="min-w-[calc(100vw-20px)] lg:min-w-[500px]"
        selectedBadgeClassName="font-normal"
        overrideSearchFn={searchFunction}
        renderOption={(option) => (
          <div className="flex w-full items-center justify-between">
            <span className="truncate">{option.label}</span>
            <span className="ml-2 truncate font-mono text-muted-foreground text-xs">
              {option.value}
            </span>
          </div>
        )}
      />
    </div>
  );
}
