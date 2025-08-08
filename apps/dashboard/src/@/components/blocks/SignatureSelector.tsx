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
  value: string | string[];
  onChange: (val: string | string[]) => void;
  setAbi?: (abi: string) => void;
  placeholder?: string;
  disabled?: boolean;
  secondaryTextFormatter?: (sig: SignatureOption) => string;
  className?: string;
  multiSelect?: boolean;
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
  multiSelect = false,
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

  // Handle both single and multi-select values
  const currentValues = useMemo((): string[] => {
    if (multiSelect) {
      if (Array.isArray(value)) {
        return value.filter(
          (val): val is string =>
            val !== undefined && val !== null && val !== "",
        );
      } else {
        return value ? [value] : [];
      }
    } else {
      if (Array.isArray(value)) {
        return value.length > 0 && value[0] ? [value[0]] : [];
      } else {
        return value ? [value] : [];
      }
    }
  }, [value, multiSelect]);

  // Check if the current values include custom values (not in options)
  const customValues = useMemo((): string[] => {
    return currentValues.filter(
      (val): val is string =>
        val !== undefined &&
        val !== null &&
        val !== "" &&
        !options.some((opt) => opt.value === val),
    );
  }, [currentValues, options]);

  // Add the custom values as options if needed
  const allOptions = useMemo(() => {
    const customOptions = customValues.map((val) => ({
      label: val,
      value: val,
    }));
    return [...formattedOptions, ...customOptions];
  }, [formattedOptions, customValues]);

  // Multi-select or single-select MultiSelect wrapper
  const handleSelectedValuesChange = useCallback(
    (selected: string[]) => {
      if (multiSelect) {
        // Multi-select behavior
        onChange(selected);
        // For multi-select, we'll use the ABI from the first selected option that has one
        const firstOptionWithAbi = selected.find((selectedValue) => {
          const found = options.find((opt) => opt.value === selectedValue);
          return found?.abi;
        });
        if (setAbi && firstOptionWithAbi) {
          const found = options.find((opt) => opt.value === firstOptionWithAbi);
          setAbi(found?.abi || "");
        }
      } else {
        // Single-select behavior (maintain backward compatibility)
        const selectedValue =
          selected.length > 0 ? (selected[selected.length - 1] ?? "") : "";
        onChange(selectedValue);
        const found = options.find((opt) => opt.value === selectedValue);
        if (setAbi) {
          setAbi(found?.abi || "");
        }
      }
      setSearchValue("");
    },
    [onChange, setAbi, options, multiSelect],
  );

  // Handle custom value entry
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchValue.trim()) {
      if (!options.some((opt) => opt.value === searchValue.trim())) {
        if (multiSelect) {
          // Add to existing values for multi-select
          const currentArray = Array.isArray(value)
            ? value
            : value
              ? [value]
              : [];
          const filteredArray = currentArray.filter(
            (val): val is string => val !== undefined && val !== null,
          );
          const newValues = [...filteredArray, searchValue.trim()];
          onChange(newValues);
        } else {
          // Replace value for single-select
          onChange(searchValue.trim());
        }
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
        maxCount={multiSelect ? 100 : 1}
        onSelectedValuesChange={handleSelectedValuesChange}
        options={allOptions}
        overrideSearchFn={(option, searchTerm) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.value.toLowerCase().includes(searchTerm.toLowerCase())
        }
        placeholder={placeholder}
        renderOption={(option) => <span>{option.label}</span>}
        searchPlaceholder={placeholder}
        selectedValues={currentValues}
      />
      {customValues.length > 0 && (
        <div className="mt-2 rounded border border-warning-200 bg-warning-50 px-2 py-1 text-warning-700 text-xs">
          {multiSelect
            ? `You entered ${customValues.length} custom signature${customValues.length > 1 ? "s" : ""}. Please provide the ABI below.`
            : "You entered a custom signature. Please provide the ABI below."}
        </div>
      )}
    </div>
  );
}
