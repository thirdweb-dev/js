/** biome-ignore-all lint/a11y/useSemanticElements: EXPECTED */

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { SMSCountryTiers } from "../../api/sms";
import {
  countryNames,
  countryPrefixes,
  getCountryFlag,
  tierPricing,
} from "./utils";

interface CountrySelectorProps {
  countryTiers: SMSCountryTiers;
  selected: string[];
  onChange: (selectedCountries: string[]) => void;
}

export default function CountrySelector({
  countryTiers,
  selected,
  onChange,
}: CountrySelectorProps) {
  // Helper function to check if a country is selected
  const isCountrySelected = (country: string) => selected.includes(country);

  // Check if all countries in a tier are selected
  const isTierSelected = (tier: string) => {
    const tierCountries = countryTiers[tier as keyof typeof countryTiers];
    return tierCountries.every((country) => isCountrySelected(country));
  };

  // Toggle a tier selection
  const toggleTier = (tier: string) => {
    const tierCountries = countryTiers[tier as keyof typeof countryTiers];
    let newSelected: string[];

    if (isTierSelected(tier)) {
      // Deselect all countries in this tier
      newSelected = selected.filter(
        (country) => !tierCountries.includes(country),
      );
    } else {
      // Select all countries in this tier
      const currentSelected = new Set(selected);
      for (const country of tierCountries) {
        currentSelected.add(country);
      }
      newSelected = Array.from(currentSelected);
    }

    // Call onChange with the updated selection
    onChange(newSelected);
  };

  // Toggle a single country selection
  const toggleCountry = (country: string) => {
    let newSelected: string[];

    if (isCountrySelected(country)) {
      // Remove country from selection
      newSelected = selected.filter((c) => c !== country);
    } else {
      // Add country to selection
      newSelected = [...selected, country];
    }

    // Call onChange with the updated selection
    onChange(newSelected);
  };

  return (
    <div className="space-y-5">
      {Object.entries(countryTiers).map(([tier, tierCountries], index) => {
        const selectedTierCountries = tierCountries.filter((country) =>
          isCountrySelected(country),
        );

        return (
          <TierCard
            key={tier}
            tierIndex={index}
            tier={tier}
            onToggleTier={() => toggleTier(tier)}
            tierCountries={tierCountries}
            selectedTierCountries={selectedTierCountries}
            onToggleCountry={toggleCountry}
          />
        );
      })}
    </div>
  );
}

function TierCard(props: {
  tier: string;
  tierIndex: number;
  onToggleTier: () => void;
  tierCountries: string[];
  selectedTierCountries: string[];
  onToggleCountry: (country: string) => void;
}) {
  const {
    tier,
    tierIndex,
    onToggleTier,
    tierCountries: countries,
    selectedTierCountries: selectedCountries,
    onToggleCountry,
  } = props;

  const [isExpanded, setIsExpanded] = useState(true);
  const isPartiallySelected =
    selectedCountries.length > 0 && selectedCountries.length < countries.length;
  const isTierFullySelected = selectedCountries.length === countries.length;

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      {/* header */}
      <div className="flex items-center px-4 py-3 gap-3 justify-between">
        {/* left */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={
              isPartiallySelected ? "indeterminate" : isTierFullySelected
            }
            id={`tier-${tier}`}
            onCheckedChange={onToggleTier}
          />
          <label
            className="flex-1 cursor-pointer font-medium text-sm"
            htmlFor={`tier-${tier}`}
          >
            Tier {tierIndex + 1}
          </label>

          {isPartiallySelected && (
            <span className="text-muted-foreground text-sm">
              ({selectedCountries.length}/{countries.length})
            </span>
          )}
        </div>

        {/* right */}
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "text-sm",
              tier === "tier1"
                ? "text-green-600 dark:text-green-500"
                : "text-muted-foreground",
            )}
          >
            {tierPricing[tier as keyof typeof tierPricing]}
          </span>

          <Button
            variant="ghost"
            className="p-0 size-7"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDownIcon
              className={cn(
                "size-4 transition-transform",
                isExpanded && "rotate-180",
              )}
            />
          </Button>
        </div>
      </div>

      {/* body */}
      {isExpanded && (
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 translate-y-[1px] translate-x-[1px] -ml-[1px] border-t",
          )}
        >
          {countries.map((country) => {
            const isSelected = selectedCountries.includes(country);
            return (
              <Button
                variant="outline"
                className={cn(
                  "justify-between gap-3 text-start h-auto rounded-none border-l-0 border-t-0 border-border py-2.5 bg-background",
                )}
                key={country}
                onClick={() => onToggleCountry(country)}
                title={countryNames[country] || country}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{getCountryFlag(country)}</div>
                  <div className="space-y-0.5">
                    <div className="font-medium text-sm">
                      {countryNames[country] || country}
                    </div>
                    <div className="text-muted-foreground text-xs tabular-nums">
                      {countryPrefixes[country]
                        ? `${countryPrefixes[country]}`
                        : ""}
                    </div>
                  </div>
                </div>
                {isSelected && <CheckIcon className="size-5 text-foreground" />}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
