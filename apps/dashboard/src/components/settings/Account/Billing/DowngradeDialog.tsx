import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Textarea,
} from "@chakra-ui/react";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button, MenuItem, Text } from "tw-components";

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
  oldPlanFeatures: Array<string | string[]>;
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
    // @ts-expect-error - this works fine
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
                    <div
                      className="flex flex-row items-center gap-2"
                      key={Array.isArray(feat) ? feat[0] : feat}
                    >
                      <XIcon className="size-4 text-destructive-text" />
                      <Text>{Array.isArray(feat) ? feat[0] : feat}</Text>
                    </div>
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
                        rightIcon={<ChevronDownIcon className="size-4" />}
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
            <div className="flex flex-row items-center gap-3">
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
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
