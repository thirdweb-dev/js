import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Flex,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Textarea,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";

import { Button, Text, MenuItem } from "tw-components";

const DOWNGRADE_OPTIONS = {
  customer_service: "Not happy with customer service",
  low_quality: "Low quality products",
  missing_features: "Missing features",
  switched_service: "Switched to another service",
  too_complex: "Too complex",
  too_expensive: "Too expensive",
  unused: "No longer in use",
  other: "Other",
};

interface BillingDowngradeDialogProps {
  oldPlan: string;
  newPlan: string;
  oldPlanFeatures: string[];
  loading: boolean;
  onClose: () => void;
  onConfirm: (feedback: string) => void;
}

export const BillingDowngradeDialog: React.FC<BillingDowngradeDialogProps> = ({
  oldPlan,
  newPlan,
  oldPlanFeatures,
  loading,
  onClose,
  onConfirm,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [feedback, setFeedback] = useState("");
  const [otherFeedback, setOtherFeedback] = useState("");

  return (
    <AlertDialog isOpen leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent minW={{ base: "auto", md: "lg" }}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Are you sure you want to downgrade to {newPlan} plan?
          </AlertDialogHeader>

          <AlertDialogBody>
            <Flex flexDir="column" gap={8}>
              <Flex flexDir="column" gap={4}>
                <Text>
                  You will lose access to these features & rate limits:
                </Text>
                <Flex flexDir="column" gap={2}>
                  {oldPlanFeatures.map((feat) => (
                    <HStack key={feat}>
                      <Icon as={FiX} boxSize={4} color="red.500" />
                      <Text>{Array.isArray(feat) ? feat[0] : feat}</Text>
                    </HStack>
                  ))}
                </Flex>
              </Flex>

              <Flex flexDir="column" gap={4}>
                <Text>Why are you downgrading?</Text>
                <Menu>
                  {({ isOpen }) => (
                    <>
                      <MenuButton
                        isActive={isOpen}
                        as={Button}
                        variant="outline"
                        w="full"
                        fontSize="small"
                        textAlign="left"
                        rightIcon={<FiChevronDown />}
                      >
                        {feedback
                          ? DOWNGRADE_OPTIONS[
                              feedback as keyof typeof DOWNGRADE_OPTIONS
                            ]
                          : "Choose reason"}
                      </MenuButton>
                      <MenuList>
                        {Object.keys(DOWNGRADE_OPTIONS).map((reason) => (
                          <MenuItem
                            key={reason}
                            value={reason}
                            onClick={() => setFeedback(reason)}
                          >
                            {
                              DOWNGRADE_OPTIONS[
                                reason as keyof typeof DOWNGRADE_OPTIONS
                              ]
                            }
                          </MenuItem>
                        ))}
                      </MenuList>
                    </>
                  )}
                </Menu>
                {feedback === "other" && (
                  <Textarea
                    value={otherFeedback}
                    onChange={(e) => setOtherFeedback(e.target.value)}
                    placeholder="Please specify the reason."
                  />
                )}
              </Flex>
            </Flex>
          </AlertDialogBody>

          <AlertDialogFooter>
            <HStack alignItems="center" gap={3}>
              <Button
                onClick={() =>
                  onConfirm(feedback === "other" ? otherFeedback : feedback)
                }
                isLoading={loading}
                isDisabled={
                  !feedback.length || (feedback === "other" && !otherFeedback)
                }
                size="sm"
                variant="outline"
              >
                Downgrade to {newPlan}
              </Button>
              <Button ref={cancelRef} onClick={onClose} size="sm">
                Keep {oldPlan} plan
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
