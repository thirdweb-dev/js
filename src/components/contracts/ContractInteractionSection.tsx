import { Box } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { useState } from "react";

export const ContractInteractionSection = () => {
  const [contractStateOne, setContractStateOne] = useState(true);
  const [contractStateTwo, setContractStateTwo] = useState(false);

  return (
    <Box position="relative" display={{ base: "none", md: "inline" }}>
      <Box
        width="full"
        pointerEvents={contractStateOne ? "all" : "none"}
        opacity={contractStateOne ? 1 : 0}
        transition="500ms ease"
      >
        <Box
          top="8.5%"
          right="48%"
          position="absolute"
          width="14.5%"
          height="10%"
          borderRadius="18px"
          cursor="pointer"
          onMouseOver={() => {
            setContractStateTwo(true);
            setContractStateOne(false);
          }}
        />
        <ChakraNextImage
          src={require("../../../public/assets/contracts/complete-solidity-v2.png")}
          priority
          alt=""
        />
      </Box>

      <Box
        position="absolute"
        top={0}
        right={0}
        left={0}
        bottom={0}
        width="full"
        height="full"
        pointerEvents={contractStateTwo ? "all" : "none"}
        opacity={contractStateTwo ? 1 : 0}
        transition="500ms ease"
      >
        <Box
          top="23%"
          right="39%"
          position="absolute"
          width="14.5%"
          height="10%"
          borderRadius="18px"
          cursor="pointer"
          onMouseOver={() => {
            setContractStateOne(true);
            setContractStateTwo(false);
          }}
        />
        <ChakraNextImage
          src={require("../../../public/assets/contracts/complete-solidity.png")}
          priority
          alt=""
        />
      </Box>
    </Box>
  );
};
