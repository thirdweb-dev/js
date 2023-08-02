import { Flex, FormControl, Input } from "@chakra-ui/react";
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { utils } from "ethers";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LinkButton, Text } from "tw-components";

interface DeployContractCheckProps {
  setHasDeployed: Dispatch<SetStateAction<boolean>>;
}

export const DeployContractCheck: React.FC<DeployContractCheckProps> = ({
  setHasDeployed,
}) => {
  const address = useAddress();
  const abi = [
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ];

  const [invalidAddress, setInvalidAddress] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [hasClickedDeployButton, setHasClickedDeployButton] = useState(false);
  const [shouldShowInput, setShouldShowInput] = useState(false);
  const { contract } = useContract(contractAddress, abi);
  const owner = useContractRead(contract, "owner");

  useEffect(() => {
    if (owner?.data && owner.data === address) {
      setHasDeployed(true);
    }
  }, [owner.data, address, setHasDeployed]);

  useEffect(() => {
    if (hasClickedDeployButton) {
      setTimeout(() => {
        setShouldShowInput(true);
      }, 5000);
    }
  }, [hasClickedDeployButton]);

  return (
    <Flex flexDir="column" gap={4}>
      <Flex gap={6}>
        <LinkButton
          href="/explore"
          isExternal
          noIcon
          color="bgWhite"
          bgColor="bgBlack"
          _hover={{
            opacity: 0.8,
          }}
          onClick={() => setHasClickedDeployButton(true)}
        >
          Deploy with thirdweb
        </LinkButton>
        <LinkButton
          href="https://blog.thirdweb.com/optimism-superchain-faucet-nft"
          isExternal
          variant="link"
        >
          View Guide
        </LinkButton>
      </Flex>
      {shouldShowInput && (
        <>
          <Text>
            We weren&apos;t able to automatically detect any deployed contracts,
            please paste a valid contract address below.
          </Text>
          <FormControl as={Flex} flexDir="column" gap={2}>
            <Input
              placeholder="Enter contract address"
              value={contractAddress}
              onChange={(e) => {
                setContractAddress(e.target.value);
                if (utils.isAddress(e.target.value)) {
                  setInvalidAddress(false);
                } else {
                  setInvalidAddress(true);
                }
              }}
            />
            {utils.isAddress(contractAddress) && owner.data !== address && (
              <Text size="body.sm" color="red.500">
                You&apos;re not the owner of this contract.
              </Text>
            )}
            {invalidAddress && (
              <Text size="body.sm" color="red.500">
                Invalid contract address.
              </Text>
            )}
          </FormControl>
        </>
      )}
    </Flex>
  );
};
