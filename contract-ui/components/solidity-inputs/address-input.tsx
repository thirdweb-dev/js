import { SolidityInputProps } from ".";
import { validateAddress } from "./helpers";
import { Box, Flex, Icon, Input, Spinner } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { useEns } from "components/contract-components/hooks";
import { utils } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { FormHelperText } from "tw-components";

export const SolidityAddressInput: React.FC<SolidityInputProps> = ({
  formContext: form,
  ...inputProps
}) => {
  const { name, ...restOfInputProps } = inputProps;
  const inputName = name as string;
  const inputNameWatch = form.watch(inputName);
  const [localInput, setLocalInput] = useState(inputNameWatch);
  const address = useAddress();

  const ensQuery = useEns(localInput);

  const { setValue, clearErrors } = form;

  const handleChange = (value: string) => {
    setLocalInput(value);
    // if it's an address we can set it immediately
    if (utils.isAddress(value)) {
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

  useEffect(() => {
    if (ensQuery.isError) {
      form.setError(inputName, {
        type: "pattern",
        message: "Failed to resolve ENS name.",
      });
    }
  }, [ensQuery.isError, form, inputName]);

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
      localInput?.endsWith(".eth") &&
      !ensQuery.isError &&
      !ensQuery.data?.address,
    [ensQuery.data?.address, ensQuery.isError, localInput],
  );

  const resolvedAddress = useMemo(
    () => localInput?.endsWith(".eth") && !hasError && ensQuery.data?.address,
    [ensQuery.data?.address, hasError, localInput],
  );

  const ensFound = useMemo(
    () => utils.isAddress(localInput) && !hasError && ensQuery?.data?.ensName,
    [ensQuery?.data?.ensName, hasError, localInput],
  );

  useEffect(() => {
    // Check if the default value has changed and update localInput
    if (inputNameWatch !== localInput && inputNameWatch === address) {
      setLocalInput(inputNameWatch);
    }
  }, [inputNameWatch, localInput, address]);

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

      {hasError ? null : (
        <FormHelperText>
          <Flex gap={1} align="center">
            {resolvingEns ? (
              <Spinner boxSize={3} mr={1} size="xs" speed="0.6s" />
            ) : resolvedAddress || ensFound ? (
              <Icon boxSize={3} as={FiCheck} color="green.500" />
            ) : null}
            {resolvingEns ? (
              "Resolving ENS..."
            ) : resolvedAddress ? (
              <Box as="span" fontFamily="mono">
                {ensQuery?.data?.address}
              </Box>
            ) : ensFound ? (
              <Box as="span" fontFamily="mono">
                {ensQuery?.data?.ensName}
              </Box>
            ) : null}
          </Flex>
        </FormHelperText>
      )}
    </>
  );
};
