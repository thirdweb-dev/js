import { CheckIcon, MinusIcon } from "lucide-react";
import type { SMSCountryTiers } from "@/api/sms";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
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

  // Check if some countries in a tier are selected
  const isTierIndeterminate = (tier: string) => {
    const tierCountries = countryTiers[tier as keyof typeof countryTiers];
    const selectedInTier = tierCountries.filter((country) =>
      isCountrySelected(country),
    );
    return (
      selectedInTier.length > 0 && selectedInTier.length < tierCountries.length
    );
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

  // Get selected countries count for a tier
  const getSelectedCountInTier = (tier: string) => {
    const tierCountries = countryTiers[tier as keyof typeof countryTiers];
    return tierCountries.filter((country) => isCountrySelected(country)).length;
  };

  return (
    <div className="space-y-3">
      {Object.entries(countryTiers).map(([tier, countries], index) => (
        <div className="overflow-hidden rounded-md border" key={tier}>
          <div className="flex items-center bg-muted/30 p-2">
            <div className="relative mr-2 flex items-center">
              <Checkbox
                checked={isTierSelected(tier)}
                className="h-4 w-4"
                id={`tier-${index + 1}`}
                onCheckedChange={() => toggleTier(tier)}
              />
              {isTierIndeterminate(tier) && (
                <MinusIcon className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 h-2.5 w-2.5 transform text-primary" />
              )}
            </div>
            <label
              className="flex-1 cursor-pointer font-medium text-sm"
              htmlFor={`tier-${index + 1}`}
            >
              Tier {index + 1}
              {isTierIndeterminate(tier) && (
                <span className="ml-1 font-normal text-muted-foreground text-xs">
                  ({getSelectedCountInTier(tier)}/{countries.length})
                </span>
              )}
            </label>
            <span
              className={cn(
                "font-medium text-xs",
                tier === "tier1"
                  ? "text-green-600 dark:text-green-500"
                  : "text-muted-foreground",
              )}
            >
              {tierPricing[tier as keyof typeof tierPricing]}
            </span>
          </div>

          <div
            className={cn(
              "grid grid-cols-2 gap-1.5 p-2",
              countries.length === 2
                ? "md:grid-cols-2"
                : countries.length === 3
                  ? "md:grid-cols-3"
                  : "md:grid-cols-4",
            )}
          >
            {countries.map((country) => (
              <div
                className={cn(
                  "relative flex cursor-pointer items-center justify-between rounded-md border p-1.5 transition-colors ",
                  isCountrySelected(country)
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:bg-muted/50",
                )}
                key={country}
                onClick={() => toggleCountry(country)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleCountry(country);
                  }
                }}
                // biome-ignore lint/a11y/useSemanticElements: FIXME
                role="button"
                tabIndex={0}
                title={countryNames[country] || country}
              >
                <span className="flex items-center space-x-2">
                  <span aria-hidden="true" className="text-lg">
                    {getCountryFlag(country)}
                  </span>
                  <span className="font-medium text-xs">
                    {countryNames[country] || country}
                    {countryPrefixes[country]
                      ? ` (${countryPrefixes[country]})`
                      : ""}
                  </span>
                </span>
                <div className="flex h-3 w-3 items-center justify-center">
                  {isCountrySelected(country) && (
                    <CheckIcon className="h-3 w-3 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
