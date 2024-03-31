import { ClaimConditionTypeData, useClaimConditionsFormContext } from ".";
import { PricePreview } from "../price-preview";
import { ClaimPriceInput } from "./Inputs/ClaimPriceInput";
import { ClaimerSelection } from "./Inputs/ClaimerSelection";
import { CreatorInput } from "./Inputs/CreatorInput";
import { MaxClaimablePerWalletInput } from "./Inputs/MaxClaimablePerWalletInput";
import { MaxClaimableSupplyInput } from "./Inputs/MaxClaimableSupplyInput";
import { PhaseNameInput } from "./Inputs/PhaseNameInput";
import { PhaseStartTimeInput } from "./Inputs/PhaseStartTimeInput";
import { WaitingTimeInput } from "./Inputs/WaitingTimeInput";
import { CustomFormGroup } from "./common";
import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { Box, Flex, Icon, SimpleGrid } from "@chakra-ui/react";
import { DropContract } from "@thirdweb-dev/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { FiX } from "react-icons/fi";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";
import { Badge, Button, Card, Heading, Text } from "tw-components";

interface ClaimConditionsPhaseProps {
  contract: DropContract;
  onRemove: () => void;
  isLoading: boolean;
}

export const ClaimConditionsPhase: React.FC<ClaimConditionsPhaseProps> = ({
  contract,
  onRemove,
  isLoading,
}) => {
  const {
    form,
    field,
    isErc20,
    isClaimPhaseV1,
    isAdmin,
    claimConditionType,
    isActive,
    isMultiPhase,
    phaseIndex,
  } = useClaimConditionsFormContext();

  const toggleEditing = () => {
    form.setValue(`phases.${phaseIndex}.isEditing`, !field.isEditing);
  };

  return (
    <Card position="relative" p={8}>
      <Flex direction="column" gap={8}>
        <Flex
          align="flex-start"
          justify="space-between"
          position="absolute"
          top="10px"
          right="10px"
          gap={1}
        >
          <Button
            variant="ghost"
            onClick={toggleEditing}
            size="sm"
            rightIcon={
              <Icon
                as={field.isEditing ? RxCaretUp : RxCaretDown}
                boxSize={5}
              />
            }
          >
            {field.isEditing ? "Collapse" : isAdmin ? "Edit" : "See Phase"}
          </Button>
          <AdminOnly contract={contract as ValidContractInstance}>
            <Button
              variant="ghost"
              onClick={onRemove}
              isDisabled={isLoading}
              colorScheme="red"
              size="sm"
              rightIcon={<Icon as={FiX} />}
            >
              Remove
            </Button>
          </AdminOnly>
        </Flex>

        <Flex flexDir="column" gap={2} mt={{ base: 4, md: 0 }}>
          <Flex gap={3} alignItems="center">
            <Heading>
              {isClaimPhaseV1
                ? isMultiPhase
                  ? `Claim Phase ${phaseIndex + 1}`
                  : "Claim Conditions"
                : ClaimConditionTypeData[claimConditionType].name}
            </Heading>
            {isActive && (
              <Badge colorScheme="green" borderRadius="lg" p={1.5}>
                Currently active
              </Badge>
            )}
          </Flex>
          {isClaimPhaseV1 ? (
            ""
          ) : (
            <Text>
              {ClaimConditionTypeData[claimConditionType].description}
            </Text>
          )}
        </Flex>

        {!field.isEditing ? (
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={2}>
            <Flex direction="column">
              <Text fontWeight="bold">Phase start</Text>
              <Text>{field.startTime?.toLocaleString()}</Text>
            </Flex>
            <Flex direction="column">
              <Text fontWeight="bold">
                {isErc20 ? "Tokens" : "NFTs"} to drop
              </Text>
              <Text textTransform="capitalize">{field.maxClaimableSupply}</Text>
            </Flex>
            <PricePreview
              price={field.price}
              currencyAddress={field.currencyAddress}
            />
            <Flex direction="column">
              <Text fontWeight="bold">Limit per wallet</Text>
              {claimConditionType === "specific" ? (
                <Text>Set in the snapshot</Text>
              ) : claimConditionType === "creator" ? (
                <Text>Unlimited</Text>
              ) : (
                <Text textTransform="capitalize">
                  {field.maxClaimablePerWallet}
                </Text>
              )}
            </Flex>
          </SimpleGrid>
        ) : (
          <>
            <CustomFormGroup>
              {/* Phase Name Input / Form Title */}
              {isMultiPhase ? <PhaseNameInput /> : null}
              <PhaseStartTimeInput />
            </CustomFormGroup>

            <CreatorInput
              creatorAddress={
                (field.snapshot?.[0] as { address: string })?.address
              }
            />

            <CustomFormGroup>
              <MaxClaimableSupplyInput />
              <ClaimPriceInput />
            </CustomFormGroup>

            {claimConditionType === "specific" ||
            claimConditionType === "creator" ? null : (
              <CustomFormGroup>
                <MaxClaimablePerWalletInput />
                {isClaimPhaseV1 ? (
                  <WaitingTimeInput />
                ) : (
                  <Box w="100%" display={{ base: "none", md: "block" }} />
                )}
              </CustomFormGroup>
            )}

            <ClaimerSelection />
          </>
        )}
      </Flex>
    </Card>
  );
};
