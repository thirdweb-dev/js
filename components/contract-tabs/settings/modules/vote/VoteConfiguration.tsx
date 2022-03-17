import { useVoteContractMetadata } from "@3rdweb-sdk/react/hooks/useVote";
import {
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Vote } from "@thirdweb-dev/sdk";
import { Card } from "components/layout/Card";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface IVoteConfiguration {
  contract?: Vote;
}

export const VoteConfiguration: React.FC<IVoteConfiguration> = ({
  contract,
}) => {
  const { data, isLoading } = useVoteContractMetadata(contract?.getAddress());
  const { watch, setValue } = useForm();

  useEffect(() => {
    if (data && !isLoading) {
      setValue(
        "proposal_token_threshold",
        data.proposal_token_threshold?.toString(),
      );
      setValue("voting_delay_in_blocks", data.voting_delay_in_blocks);
      setValue("voting_period_in_blocks", data.voting_period_in_blocks);
      setValue("voting_quorum_fraction", data.voting_quorum_fraction);
      setValue("voting_token_address", data.voting_token_address);
    }
  }, [data, isLoading, setValue]);

  return (
    <Stack>
      <Card position="relative" pb="72px">
        <Stack spacing={4}>
          <Flex direction="column">
            <Heading size="title.md">Vote Settings</Heading>
            <Text size="body.md" fontStyle="italic">
              These settings determine the voting process of this contract. In
              order to change these settings, you must create a proposal for
              token holders to vote on.
            </Text>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <FormControl isDisabled>
              <FormLabel>Governance Token Address</FormLabel>
              <Input variant="filled" value={watch("voting_token_address")} />
              <FormHelperText>
                The address of the token that will be used to vote on this
                contract.
              </FormHelperText>
            </FormControl>
            <FormControl isDisabled>
              <FormLabel>Proposal Token Threshold</FormLabel>
              <NumberInput
                variant="filled"
                value={watch("proposal_token_threshold")}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                The minimum number of voting tokens a wallet needs in order to
                create proposals.
              </FormHelperText>
            </FormControl>
            <FormControl isDisabled>
              <FormLabel>Voting Delay</FormLabel>
              <NumberInput
                variant="filled"
                value={watch("voting_delay_in_blocks")}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                The number of blocks after a proposal is created that voting on
                the proposal starts.
              </FormHelperText>
            </FormControl>
            <FormControl isDisabled>
              <FormLabel>Voting Period</FormLabel>
              <NumberInput
                variant="filled"
                value={watch("voting_period_in_blocks")}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                The number of blocks that voters have to vote on any new
                proposal.
              </FormHelperText>
            </FormControl>
            <FormControl isDisabled>
              <FormLabel>Voting Quorum</FormLabel>
              <NumberInput
                variant="filled"
                value={watch("voting_quorum_fraction")}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                The fraction of the total voting power that is required for a
                proposal to pass.
              </FormHelperText>
            </FormControl>
          </SimpleGrid>
        </Stack>
      </Card>
    </Stack>
  );
};
