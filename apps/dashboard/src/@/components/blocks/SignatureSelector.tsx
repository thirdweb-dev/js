import { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MultiSelect } from "./multi-select";

interface SignatureOption {
  label: string;
  value: string;
  abi?: string;
}

interface SignatureSelectorProps {
  options: SignatureOption[];
  value: string;
  onChange: (val: string) => void;
  setAbi?: (abi: string) => void;
  placeholder?: string;
  disabled?: boolean;
  secondaryTextFormatter?: (sig: SignatureOption) => string;
  className?: string;
}

export function SignatureSelector({
  options,
  value,
  onChange,
  setAbi,
  placeholder = "Select or enter a signature",
  disabled,
  secondaryTextFormatter,
  className,
}: SignatureSelectorProps) {
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoize options with formatted secondary text if provided
  const formattedOptions = useMemo(() => {
    return options.map((opt) => ({
      ...opt,
      label: secondaryTextFormatter
        ? `${opt.label}  •  ${secondaryTextFormatter(opt)}`
        : opt.label,
    }));
  }, [options, secondaryTextFormatter]);

  // Check if the current value is a custom value (not in options)
  const isCustomValue = value && !options.some((opt) => opt.value === value);

  // Add the custom value as an option if needed
  const allOptions = useMemo(() => {
    if (isCustomValue && value) {
      return [...formattedOptions, { label: value, value }];
    }
    return formattedOptions;
  }, [formattedOptions, isCustomValue, value]);

  // Single-select MultiSelect wrapper
  const handleSelectedValuesChange = useCallback(
    (selected: string[]) => {
      // Always use the last selected value for single-select behavior
      const selectedValue =
        selected.length > 0 ? (selected[selected.length - 1] ?? "") : "";
      onChange(selectedValue);
      const found = options.find((opt) => opt.value === selectedValue);
      if (setAbi) {
        setAbi(found?.abi || "");
      }
      setSearchValue("");
    },
    [onChange, setAbi, options],
  );

  // Handle custom value entry
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchValue.trim()) {
      if (!options.some((opt) => opt.value === searchValue.trim())) {
        onChange(searchValue.trim());
        if (setAbi) setAbi("");
        setSearchValue("");
        // Optionally blur input
        inputRef.current?.blur();
      }
    }
  };

  // Custom render for MultiSelect's search input
  const customSearchInput = (
    <input
      autoComplete="off"
      className={cn(
        "w-full border-0 border-border border-b bg-transparent py-4 pr-2 pl-10 text-sm focus-visible:ring-0 focus-visible:ring-offset-0",
        disabled && "cursor-not-allowed opacity-50",
      )}
      disabled={disabled}
      onChange={(e) => setSearchValue(e.target.value)}
      onKeyDown={handleInputKeyDown}
      placeholder={placeholder}
      ref={inputRef}
      type="text"
      value={searchValue}
    />
  );

  return (
    <div className={className}>
      <MultiSelect
        customSearchInput={customSearchInput}
        customTrigger={null}
        disabled={disabled}
        maxCount={1}
        onSelectedValuesChange={handleSelectedValuesChange}
        options={allOptions}
        overrideSearchFn={(option, searchTerm) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.value.toLowerCase().includes(searchTerm.toLowerCase())
        }
        placeholder={placeholder}
        renderOption={(option) => <span>{option.label}</span>}
        searchPlaceholder={placeholder}
        selectedValues={value ? [value] : []}
      />
      {isCustomValue && (
        <div className="mt-2 rounded border border-warning-200 bg-warning-50 px-2 py-1 text-warning-700 text-xs">
          You entered a custom signature. Please provide the ABI below.
        </div>
      )}
    </div>
  );
}
