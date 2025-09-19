"use client";

import type { SwapWidgetProps } from "thirdweb/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CurrencySelector(props: {
  value: SwapWidgetProps["currency"];
  onChange: (value: SwapWidgetProps["currency"]) => void;
}) {
  return (
    <Select
      value={props.value}
      onValueChange={(value) => {
        props.onChange(value as SwapWidgetProps["currency"]);
      }}
    >
      <SelectTrigger className="bg-card">
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="USD">USD - US Dollar</SelectItem>
        <SelectItem value="EUR">EUR - Euro</SelectItem>
        <SelectItem value="GBP">GBP - British Pound</SelectItem>
        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
        <SelectItem value="KRW">KRW - Korean Won</SelectItem>
        <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
        <SelectItem value="INR">INR - Indian Rupee</SelectItem>
        <SelectItem value="NOK">NOK - Norwegian Krone</SelectItem>
        <SelectItem value="SEK">SEK - Swedish Krona</SelectItem>
        <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
        <SelectItem value="NZD">NZD - New Zealand Dollar</SelectItem>
        <SelectItem value="MXN">MXN - Mexican Peso</SelectItem>
        <SelectItem value="BRL">BRL - Brazilian Real</SelectItem>
        <SelectItem value="CLP">CLP - Chilean Peso</SelectItem>
        <SelectItem value="CZK">CZK - Czech Koruna</SelectItem>
        <SelectItem value="DKK">DKK - Danish Krone</SelectItem>
        <SelectItem value="HKD">HKD - Hong Kong Dollar</SelectItem>
        <SelectItem value="HUF">HUF - Hungarian Forint</SelectItem>
        <SelectItem value="IDR">IDR - Indonesian Rupiah</SelectItem>
        <SelectItem value="ILS">ILS - Israeli Shekel</SelectItem>
        <SelectItem value="ISK">ISK - Icelandic Krona</SelectItem>
      </SelectContent>
    </Select>
  );
}
