import {
  Icon,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { MdContentPaste } from "react-icons/md";

interface PasteInputProps extends InputProps {
  formKey: string;
}

export const PasteInput: React.FC<PasteInputProps> = ({
  formKey,
  ...inputProps
}) => {
  const { register, setValue } = useFormContext();
  return (
    <InputGroup width="full">
      <Input {...register(formKey)} placeholder="0x..." {...inputProps} />
      <InputRightElement
        pointerEvents="auto"
        children={
          <Icon
            as={MdContentPaste}
            color="gray.600"
            _hover={{
              cursor: "pointer",
              color: "bgBlack",
            }}
            onClick={() => {
              navigator.clipboard
                .readText()
                .then((text) => {
                  setValue(formKey, text);
                })
                .catch((err) => {
                  console.error("failed to paste from clipboard", err);
                });
            }}
          />
        }
      />
    </InputGroup>
  );
};
