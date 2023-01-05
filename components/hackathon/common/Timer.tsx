import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Text } from "tw-components";

interface ITimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimerProps {
  date: string;
}

const Timer: React.FC<TimerProps> = ({ date }) => {
  const calculateTimeLeft = () => {
    const difference = Number(new Date(date)) - Number(new Date());
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft as ITimeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<ITimeLeft>(calculateTimeLeft());
  const { days, hours, minutes, seconds } = timeLeft;

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const items = [
    { label: "Day", value: days },
    { label: "Hour", value: hours },
    { label: "Min", value: minutes },
    { label: "Sec", value: seconds },
  ];

  return (
    <Flex gap="2">
      {items.map(({ label, value }) => (
        <Flex flexDir="column" key={label} align="center">
          <Text
            fontSize={{ base: "36px", md: "48px" }}
            bg="#FFFFFF14"
            border="1px solid #FFFFFF1A"
            w={{ base: "60px", md: "80px" }}
            align="center"
            color="white"
          >
            {value < 10 ? `0${value}` : value}
          </Text>
          <Text color="white">{value === 1 ? label : `${label}s`}</Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default Timer;
