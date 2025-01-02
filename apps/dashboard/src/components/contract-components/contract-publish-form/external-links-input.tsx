import {
  Divider,
  Flex,
  FormControl,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { TrashIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormErrorMessage, FormLabel } from "tw-components";

interface ExternalLinksInputProps {
  index: number;
  remove: (index: number) => void;
}

export const ExternalLinksInput: React.FC<ExternalLinksInputProps> = ({
  index,
  remove,
}) => {
  const form = useFormContext();

  return (
    <Flex flexDir="column" gap={2}>
      <Flex
        w="full"
        gap={{ base: 4, md: 2 }}
        flexDir={{ base: "column", md: "row" }}
      >
        <FormControl
          as={Flex}
          flexDir="column"
          gap={1}
          isInvalid={
            !!form.getFieldState(`externalLinks.${index}.name`, form.formState)
              .error
          }
        >
          <FormLabel textTransform="capitalize">Resource Name</FormLabel>
          <Input
            placeholder="Resource name"
            {...form.register(`externalLinks.${index}.name`)}
          />
        </FormControl>
        <FormControl
          as={Flex}
          flexDir="column"
          gap={1}
          isInvalid={
            !!form.getFieldState(`externalLinks.${index}.url`, form.formState)
              .error
          }
        >
          <FormLabel textTransform="capitalize">Link</FormLabel>
          <Input
            placeholder="Provide URL to the resource page"
            {...form.register(`externalLinks.${index}.url`, {
              required: true,
              validate: (value: string) => {
                if (value.match(new RegExp(/^https:\/\/[^\s/$.?#].[^\s]*$/))) {
                  return true;
                }
                return "Provide a valid URL";
              },
            })}
          />
          <FormErrorMessage>
            {
              form.getFieldState(`externalLinks.${index}.url`, form.formState)
                .error?.message
            }
          </FormErrorMessage>
        </FormControl>
        <IconButton
          icon={<TrashIcon className="size-5" />}
          aria-label="Remove row"
          onClick={() => remove(index)}
          alignSelf="end"
        />
      </Flex>
      <Divider />
    </Flex>
  );
};
