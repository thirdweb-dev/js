"use client";

import { Input } from "@/components/ui/input";
import { Box, Spinner } from "@chakra-ui/react";
import { useEns } from "components/contract-components/hooks";
import { CheckIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { isAddress, isValidENSName } from "thirdweb/utils";
import type { SolidityInputProps } from ".";
import { validateAddress } from "./helpers";

export const SolidityAddressInput: React.FC<SolidityInputProps> = ({
  formContext: form,
  ...inputProps
}) => {
  const { name, ...restOfInputProps } = inputProps;
  const inputName = name as string;
  const [_localInput, setLocalInput] = useState<string | undefined>();
  const inputNameWatch = form.watch(inputName);
  const localInput = _localInput === undefined ? inputNameWatch : _localInput;
  const address = useActiveAccount()?.address;

  const ensQuery = useEns(localInput);

  const { setValue, clearErrors } = form;

  const handleChange = (value: string) => {
    setLocalInput(value);
    // if it's an address we can set it immediately
    if (isAddress(value)) {
      setValue(inputName, value, { shouldDirty: true });
      clearErrors(inputName);
    } else {
      // if it's not an address reset the form value
      setValue(inputName, "", { shouldDirty: true });
    }

    const inputError = validateAddress(value);

    if (inputError) {
      form.setError(inputName, inputError);
    } else {
      form.clearErrors(inputName);
    }
  };

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (ensQuery.isError) {
      form.setError(inputName, {
        type: "pattern",
        message: "Failed to resolve ENS name.",
      });
    }
  }, [ensQuery.isError, form, inputName]);

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (ensQuery?.data?.address && ensQuery?.data?.address !== inputNameWatch) {
      setValue(inputName, ensQuery.data.address, {
        shouldDirty: true,
      });
      clearErrors(inputName);
    }
  }, [
    ensQuery.data?.address,
    setValue,
    clearErrors,
    inputName,
    inputNameWatch,
  ]);

  const hasError = !!form.getFieldState(inputName, form.formState).error;

  const resolvingEns = useMemo(
    () =>
      localInput &&
      isValidENSName(localInput) &&
      !ensQuery.isError &&
      !ensQuery.data?.address,
    [ensQuery.data?.address, ensQuery.isError, localInput],
  );

  const resolvedAddress = useMemo(
    () =>
      localInput &&
      isValidENSName(localInput) &&
      !hasError &&
      ensQuery.data?.address,
    [ensQuery.data?.address, hasError, localInput],
  );

  const ensFound = useMemo(
    () => isAddress(localInput) && !hasError && ensQuery?.data?.ensName,
    [ensQuery?.data?.ensName, hasError, localInput],
  );

  // legitimate use-case (but can probably be done in form)
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // Check if the default value has changed and update localInput
    if (inputNameWatch !== localInput && inputNameWatch === address) {
      setLocalInput(inputNameWatch);
    }
  }, [inputNameWatch, localInput, address]);

  const helperTextLeft = resolvingEns ? (
    <Spinner boxSize={3} mr={1} size="xs" speed="0.6s" />
  ) : resolvedAddress || ensFound ? (
    <CheckIcon className="size-3 text-green-500" />
  ) : null;

  const helperTextRight = resolvingEns ? (
    "Resolving ENS..."
  ) : resolvedAddress ? (
    <Box as="span" fontFamily="mono">
      {ensQuery?.data?.address}
    </Box>
  ) : ensFound ? (
    <Box as="span" fontFamily="mono">
      {ensQuery?.data?.ensName}
    </Box>
  ) : null;

  return (
    <>
      <Input
        placeholder="address"
        // probably OK but obviously can be longer if ens name is passed?
        maxLength={42}
        {...restOfInputProps}
        onChange={(e) => handleChange(e.target.value)}
        // if we don't have a value from the form, use the local input (but if value is empty string then that's valid)
        value={(localInput ?? inputNameWatch) || ""}
      />

      {!hasError && (helperTextLeft || helperTextRight) && (
        <p className="mt-2 text-muted-foreground text-sm">
          <div className="items-center gap-1">
            {helperTextLeft}
            {helperTextRight}
          </div>
        </p>
      )}
    </>
  );
};
