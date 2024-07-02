import { Box, Flex, Icon } from "@chakra-ui/react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ExtensionInput } from "../contract-publish-form/extension-input";
import { FiPlus } from "react-icons/fi";
import { Button, Heading } from "tw-components";
import { useAllVersions, useEns } from "../hooks";
import { useMemo } from "react";
import { ExtensionInstallParams } from "./extension-install-params";

interface ExtensionInputFieldsetProps {
  form: UseFormReturn<any, any>;
  extensionName: string;
  extensionPublisher: string;
  extensionVersion: string;
}

export const ExtensionInputFieldset: React.FC<ExtensionInputFieldsetProps> = ({
  form,
  extensionName,
  extensionPublisher,
  extensionVersion
}) => {
//   const { fields, append, remove } = useFieldArray({
//     name: "defaultExtensions",
//     control: form.control,
//   });
  const ensQuery = useEns(extensionPublisher);
  const allVersions = useAllVersions(
    ensQuery.data?.address || undefined,
    extensionName,
  );

  const publishedExtension = useMemo(() => {
    return (
      allVersions.data?.find((v) => v.version === extensionVersion) ||
      allVersions.data?.[0]
    );
  }, [allVersions?.data, extensionVersion]);

  return (
    <Flex pb={4} direction="column" gap={2}>
      <Heading size="label.lg">{extensionName}</Heading>

        {publishedExtension && <ExtensionInstallParams
            extension={publishedExtension}
        />}
    </Flex>
  );
};
