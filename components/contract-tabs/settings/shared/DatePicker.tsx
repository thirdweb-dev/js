import { Input } from "@chakra-ui/react";
import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface IDatePicker {
  onChange: (date: Date) => any;
  selectedDate: Date | undefined;
}

const DatePicker: React.FC<IDatePicker> = ({
  selectedDate,
  onChange,
  ...props
}) => {
  return (
    <ReactDatePicker
      selected={selectedDate}
      onChange={onChange}
      showPopperArrow={false}
      showTimeSelect
      dateFormat="Pp"
      customInput={<Input variant="filled" />}
      {...props}
    />
  );
};

export default DatePicker;
