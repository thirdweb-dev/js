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
    <Flex gap={2}>
      {items.map(({ label, value }) => (
        <Flex flexDir="column" key={label} align="center">
          <Text
            fontSize={{ base: "24px", md: "32px" }}
            bg="hsl(291deg 87% 73% / 8%)"
            color="#e984f3"
            p={3}
            lineHeight={1.2}
            align="center"
            fontWeight={700}
            borderRadius={4}
            border="2px solid hsl(295deg 82% 74% / 10%)"
            style={{
              // prevent font from changing width to avoid layout shift
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value < 10 ? `0${value}` : value}{" "}
          </Text>
          <Text fontWeight={500} fontSize="14px" color="#e984f3" mt={1}>
            {value === 1 ? label : `${label}s`}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default Timer;
