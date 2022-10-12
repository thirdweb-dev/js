import { Flex, Progress } from "@chakra-ui/react";
import { UploadProgressEvent } from "@thirdweb-dev/storage";
import { useEffect, useState } from "react";
import { Text } from "tw-components";

interface ProgressBoxProps {
  progress: UploadProgressEvent;
}

export const ProgressBox: React.FC<ProgressBoxProps> = ({ progress }) => {
  const isFinished = progress.progress >= progress.total;
  const [takingLong, setTakingLong] = useState(false);

  useEffect(() => {
    if (isFinished) {
      const t = setTimeout(() => {
        setTakingLong(true);
      }, 10000);

      return () => {
        clearTimeout(t);
      };
    }
  }, [isFinished]);

  return (
    <Flex w="full" direction="column">
      {progress.progress !== 0 && (
        <Progress
          borderRadius="md"
          mt="12px"
          hasStripe
          colorScheme="blue"
          transition="500ms ease"
          value={(progress.progress / progress.total) * 100}
        />
      )}
      {takingLong && progress.progress !== 0 && (
        <Text size="body.sm" textAlign="center" mt={3}>
          This may take a while.
        </Text>
      )}
    </Flex>
  );
};
