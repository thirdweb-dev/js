"use client";

import { cn } from "@/lib/utils";
import type { ControllerRenderProps } from "react-hook-form";
import { MultiSelect } from "@/components/blocks/multi-select";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon, SearchIcon, XIcon } from "lucide-react";

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
  const { field, placeholder, endpointPath } = props;
  const { value, onChange } = field;
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const presets = useMemo(() => getAggregatePresets(endpointPath), [endpointPath]);
  
  const selectedValues = useMemo(() => {
    if (!value) return [];
    return String(value).split(',').filter(Boolean);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  const handlePresetSelect = useCallback((preset: { value: string; label: string }) => {
    const newValue = value ? `${value}, ${preset.value}` : preset.value;
    onChange({ target: { value: newValue } });
    inputRef.current?.focus();
  }, [value, onChange]);

  return (
    <div className="w-full space-y-2">
      {/* Main input field */}
      <Input
        ref={inputRef}
        value={value || ''}
        onChange={handleInputChange}
        placeholder={placeholder || "Enter aggregation formula..."}
        className="w-full font-mono text-sm"
      />
      
      {/* Preset selector */}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-between text-muted-foreground"
            type="button"
          >
            <span>Select from presets</span>
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0" align="start">
          <div className="p-2 border-b">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search aggregations..."
                className="pl-8 h-9"
              />
            </div>
          </div>
          <div className="max-h-[300px] overflow-auto p-1">
            {presets
              .filter(preset => 
                !searchQuery ||
                preset.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                preset.value.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((preset) => (
                <button
                  key={preset.value}
                  className="w-full text-left p-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-between"
                  onClick={() => handlePresetSelect(preset)}
                  type="button"
                >
                  <span>{preset.label}</span>
                  <span className="text-xs text-muted-foreground font-mono ml-2">
                    {preset.value}
                  </span>
                </button>
              ))}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Selected presets as badges */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedValues.map((val) => {
            const preset = presets.find(p => p.value === val);
            return (
              <Badge key={val} variant="secondary" className="font-normal">
                {preset?.label || val}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
