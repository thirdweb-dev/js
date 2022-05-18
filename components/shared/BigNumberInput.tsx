import {
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { BigNumber, constants, utils } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { Button } from "tw-components";

interface BigNumberInputProps extends Omit<InputProps, "value" | "onChange"> {
  value: string;
  hideMaxButton?: true;
  decimals?: number;
  maxUIntString?: string;
  onChange: (stringValue: string) => void;
  max?: string;
  min?: string;
}

export const BigNumberInput: React.FC<BigNumberInputProps> = ({
  value,
  onChange,
  hideMaxButton,
  isDisabled,
  decimals = 0,
  maxUIntString = "Unlimited",
  max = constants.MaxUint256.toString(),
  min,
  ...restInputProps
}) => {
  const [inputValue, setInputvalue] = useState("0");
  const _max = useMemo(() => {
    return utils.formatUnits(max, decimals).toString();
  }, [decimals, max]);
  // update current value
  useEffect(() => {
    if (value === undefined || value === null || value === "") {
      setInputvalue("");
    } else {
      let parseInputValue;

      try {
        parseInputValue = utils.parseUnits(inputValue || "0", decimals);
      } catch {
        // do nothing
      }

      if (!parseInputValue || !parseInputValue.eq(value)) {
        setInputvalue(utils.formatUnits(value, decimals));
      }
    }
  }, [value, decimals, inputValue, _max]);

  const updateValue = (_value: string) => {
    if (_value === "") {
      onChange(_value);
      setInputvalue(_value);
      return;
    }

    let newValue: BigNumber;
    let parsedMax: BigNumber;
    try {
      newValue = utils.parseUnits(_value, decimals);
      parsedMax = utils.parseUnits(_max, decimals);
    } catch (e) {
      // don't update the input on invalid values
      return;
    }

    const invalidValue =
      (min && newValue.lt(min)) || (_max && newValue.gt(parsedMax));
    if (invalidValue) {
      return;
    }

    setInputvalue(_value);
    onChange(newValue.toString());
  };

  return (
    <InputGroup>
      <Input
        {...restInputProps}
        type="text"
        isDisabled={isDisabled}
        value={inputValue === _max ? maxUIntString : inputValue}
        onChange={(e) => updateValue(e.currentTarget.value)}
        onFocus={(e) => e.target.select()}
      />
      {hideMaxButton ? null : (
        <InputRightElement w="auto">
          <Button
            isDisabled={isDisabled}
            colorScheme="primary"
            variant="ghost"
            size="sm"
            mr={1}
            onClick={() => {
              updateValue(_max);
            }}
          >
            Unlimited
          </Button>
        </InputRightElement>
      )}
    </InputGroup>
  );
};
