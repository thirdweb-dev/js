"use client";

import { useEns } from "components/contract-components/hooks";
import { CheckIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { isAddress, isValidENSName } from "thirdweb/utils";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import type { SolidityInputProps } from ".";
import { validateAddress } from "./helpers";

export const SolidityAddressInput: React.FC<SolidityInputProps> = ({
  formContext: form,
  client,
  ...inputProps
}) => {
  const { name, ...restOfInputProps } = inputProps;
  const inputName = name as string;
  const [_localInput, setLocalInput] = useState<string | undefined>();
  const inputNameWatch = form.watch(inputName);
  const localInput = _localInput === undefined ? inputNameWatch : _localInput;
  const address = useActiveAccount()?.address;

  const ensQuery = useEns({
    addressOrEnsName: localInput,
    client,
  });

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
        message: "Failed to resolve ENS name.",
        type: "pattern",
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
    <Spinner className="size-3" />
  ) : resolvedAddress || ensFound ? (
    <CheckIcon className="size-3 text-green-500" />
  ) : null;

  const helperTextRight = resolvingEns ? (
    "Resolving ENS..."
  ) : resolvedAddress ? (
    <span className="font-mono">{ensQuery?.data?.address}</span>
  ) : ensFound ? (
    <span className="font-mono">{ensQuery?.data?.ensName}</span>
  ) : null;

  return (
    <>
      <Input
        maxLength={42}
        // probably OK but obviously can be longer if ens name is passed?
        placeholder="address"
        {...restOfInputProps}
        onChange={(e) => handleChange(e.target.value)}
        // if we don't have a value from the form, use the local input (but if value is empty string then that's valid)
        value={(localInput ?? inputNameWatch) || ""}
      />

      {!hasError && (helperTextLeft || helperTextRight) && (
        <div className="mt-2 flex items-center gap-1 text-muted-foreground text-sm">
          {helperTextLeft}
          {helperTextRight}
        </div>
      )}
    </>
  );
};
