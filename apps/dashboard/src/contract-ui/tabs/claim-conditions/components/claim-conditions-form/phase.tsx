import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { Flex, SimpleGrid } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import { Badge, Button, Card, Heading, Text } from "tw-components";
import { ClaimConditionTypeData, useClaimConditionsFormContext } from ".";
import { PricePreview } from "../price-preview";
import { ClaimPriceInput } from "./Inputs/ClaimPriceInput";
import { ClaimerSelection } from "./Inputs/ClaimerSelection";
import { CreatorInput } from "./Inputs/CreatorInput";
import { MaxClaimablePerWalletInput } from "./Inputs/MaxClaimablePerWalletInput";
import { MaxClaimableSupplyInput } from "./Inputs/MaxClaimableSupplyInput";
import { PhaseNameInput } from "./Inputs/PhaseNameInput";
import { PhaseStartTimeInput } from "./Inputs/PhaseStartTimeInput";
import { CustomFormGroup } from "./common";

interface ClaimConditionsPhaseProps {
  contract: ThirdwebContract;
  onRemove: () => void;
  isPending: boolean;
}

export const ClaimConditionsPhase: React.FC<ClaimConditionsPhaseProps> = ({
  contract,
  onRemove,
  isPending,
}) => {
  const {
    form,
    field,
    isErc20,
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
              field.isEditing ? (
                <ChevronUpIcon className="size-4" />
              ) : (
                <ChevronDownIcon className="size-4" />
              )
            }
          >
            {field.isEditing ? "Collapse" : isAdmin ? "Edit" : "See Phase"}
          </Button>
          <AdminOnly contract={contract}>
            <Button
              variant="ghost"
              onClick={onRemove}
              isDisabled={isPending}
              colorScheme="red"
              size="sm"
              rightIcon={<XIcon className="size-4" />}
            >
              Remove
            </Button>
          </AdminOnly>
        </Flex>

        <Flex flexDir="column" gap={2} mt={{ base: 4, md: 0 }}>
          <Flex gap={3} alignItems="center">
            <Heading>{ClaimConditionTypeData[claimConditionType].name}</Heading>
            {isActive && (
              <Badge colorScheme="green" borderRadius="lg" p={1.5}>
                Currently active
              </Badge>
            )}
          </Flex>

          <Text>{ClaimConditionTypeData[claimConditionType].description}</Text>
        </Flex>

        {!field.isEditing ? (
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={2}>
            <div className="flex flex-col">
              <Text fontWeight="bold">Phase start</Text>
              <Text>{field.startTime?.toLocaleString()}</Text>
            </div>
            <div className="flex flex-col">
              <Text fontWeight="bold">
                {isErc20 ? "Tokens" : "NFTs"} to drop
              </Text>
              <Text textTransform="capitalize">{field.maxClaimableSupply}</Text>
            </div>
            <PricePreview
              price={field.price}
              currencyAddress={field.currencyAddress}
              contractChainId={contract.chain.id}
            />
            <div className="flex flex-col">
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
            </div>
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
              <ClaimPriceInput contractChainId={contract.chain.id} />
            </CustomFormGroup>

            {claimConditionType === "specific" ||
            claimConditionType === "creator" ? null : (
              <CustomFormGroup>
                <MaxClaimablePerWalletInput />
              </CustomFormGroup>
            )}

            <ClaimerSelection />
          </>
        )}
      </Flex>
    </Card>
  );
};
