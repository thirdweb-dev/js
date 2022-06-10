import { Card } from "./card";
import { FormLabel } from "./form";
import {
  FormControl,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputProps,
  InputRightAddon,
  List,
  ListItem,
  ListItemProps,
  ListProps,
  forwardRef,
} from "@chakra-ui/react";
import { UseComboboxPropGetters, useCombobox } from "downshift";
import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";

interface ComboBoxInputProps extends InputProps {
  downshiftInputProps: UseComboboxPropGetters<unknown>["getInputProps"];
  downshiftToggleButtonProps: UseComboboxPropGetters<unknown>["getToggleButtonProps"];
  isOpen: boolean;
  openMenu: () => void;
}

const ComboboxInput = forwardRef<ComboBoxInputProps, "input">(
  (
    {
      downshiftInputProps,
      downshiftToggleButtonProps,
      isOpen,
      openMenu,
      onFocus,
      ...inputRestProps
    },
    ref,
  ) => {
    return (
      <InputGroup>
        <InputLeftAddon>
          <Icon as={FiSearch} />
        </InputLeftAddon>
        <Input
          {...inputRestProps}
          onFocus={(e) => {
            openMenu();
            e.target.select();
            if (onFocus) {
              onFocus(e);
            }
          }}
          {...downshiftInputProps}
          ref={ref}
        />
        <InputRightAddon border="none" px={0}>
          <IconButton
            variant="ghost"
            borderLeftRadius="none"
            aria-label="toggle combobox"
            icon={<Icon as={isOpen ? FiChevronUp : FiChevronDown} />}
            {...downshiftToggleButtonProps}
          />
        </InputRightAddon>
      </InputGroup>
    );
  },
);

interface ComboboxListProps extends ListProps {
  isOpen: boolean;
}

const ComboboxList = forwardRef<ComboboxListProps, "ul">(
  ({ isOpen, ...props }, ref) => {
    return <List display={isOpen ? undefined : "none"} {...props} ref={ref} />;
  },
);

interface ComboboxItemProps extends ListItemProps {
  itemIndex: number;
  highlightedIndex: number;
}

const ComboboxItem = forwardRef<ComboboxItemProps, "li">(
  ({ itemIndex, highlightedIndex, ...props }, ref) => {
    const isActive = itemIndex === highlightedIndex;

    return (
      <ListItem
        transition="background-color 220ms, color 220ms"
        bg={isActive ? "purple.500" : undefined}
        color={isActive ? "white" : undefined}
        px={4}
        py={2}
        cursor="pointer"
        {...props}
        ref={ref}
      />
    );
  },
);

ComboboxInput.displayName = "ComboboxInput";

interface ComboBoxProps {
  label?: string;
  items: string[];
  defaultInputValue?: string;
  onChange: (val: string) => void;
  inputProps?: ComboBoxInputProps;
}

export const ComboBox: React.FC<ComboBoxProps> = ({
  items,
  label,
  defaultInputValue,
  onChange,
  inputProps,
}) => {
  const [inputItems, setInputItems] = useState(items);
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    openMenu,
  } = useCombobox({
    defaultInputValue,
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        items.filter((item) =>
          item.toLowerCase().startsWith(inputValue || "".toLowerCase()),
        ),
      );
    },
    onStateChange: ({ inputValue }) => {
      if (inputValue) {
        onChange(inputValue);
      }
    },
  });

  return (
    <Card
      w="full"
      py={1}
      px={1}
      mt={-1}
      ml={-1}
      overflow="hidden"
      transition="all 200ms"
      {...(isOpen
        ? {}
        : {
            bg: "transparent",
            borderColor: "transparent",
          })}
    >
      <FormControl
        {...getComboboxProps()}
        display="flex"
        flexDirection="column"
      >
        {label && <FormLabel {...getLabelProps()}>{label}</FormLabel>}
        <ComboboxInput
          placeholder="Search..."
          {...inputProps}
          openMenu={openMenu}
          downshiftInputProps={getInputProps()}
          downshiftToggleButtonProps={getToggleButtonProps()}
          isOpen={isOpen}
        />
        <ComboboxList
          isOpen={isOpen}
          {...getMenuProps()}
          overflowY="auto"
          mt={1}
          flexGrow={0}
          flexShrink={1}
          flexDirection="column"
          maxH="320px"
          mx={-1}
          mb={-1}
        >
          {inputItems.map((item, index) => (
            <ComboboxItem
              px={3}
              w="100%"
              {...getItemProps({ item, index })}
              itemIndex={index}
              highlightedIndex={highlightedIndex}
              key={index}
            >
              {item}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </FormControl>
    </Card>
  );
};
