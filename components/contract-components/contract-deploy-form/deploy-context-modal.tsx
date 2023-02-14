import {
  Center,
  Flex,
  Icon,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { createContext, useContext, useState } from "react";
import { FiActivity, FiCheck } from "react-icons/fi";
import invariant from "tiny-invariant";
import { Card, Heading, Text } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface DeployModalStep {
  title: string;
  description: string | JSX.Element;
  action?:
    | {
        type: "link";
        label: string;
        href: string;
      }
    | {
        type: "button";
        label: string;
        onClick: () => void;
      };
}

interface DeployModalContext {
  nextStep: () => void;
  open: (steps: DeployModalStep[]) => void;
  close: () => void;
  _inProvider: true;
}

const DeployModalContext = createContext<DeployModalContext>(
  {} as DeployModalContext,
);

export const DeployModalProvider: ComponentWithChildren = ({ children }) => {
  const modalState = useDisclosure();

  const [steps, setSteps] = useState<DeployModalStep[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  return (
    <DeployModalContext.Provider
      value={{
        open: (steps_) => {
          setSteps(steps_);
          modalState.onOpen();
        },
        close: () => {
          modalState.onClose();
          setSteps([]);
          setActiveStep(0);
        },
        nextStep: () => {
          setActiveStep((currStep) => {
            return currStep + 1;
          });
        },

        _inProvider: true,
      }}
    >
      {children}
      <Modal
        closeOnEsc
        closeOnOverlayClick
        // can only be closed by the context
        onClose={() => undefined}
        isOpen={modalState.isOpen}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as={Card} borderRadius="xl">
          <Flex flexDir="column" gap={4}>
            <Heading size="subtitle.sm">Deploy Status</Heading>
            {steps.map((step, i) => {
              const isActive = i === activeStep;
              const hasCompleted = i < activeStep;
              return (
                <DeployModalStep
                  key={step.title}
                  {...step}
                  isActive={isActive}
                  hasCompleted={hasCompleted}
                />
              );
            })}
          </Flex>
        </ModalContent>
      </Modal>
    </DeployModalContext.Provider>
  );
};

export function useDeployContextModal() {
  const { _inProvider, ...context } = useContext(DeployModalContext);
  invariant(
    _inProvider,
    "useDeployContextModal must be used within DeployModalProvider",
  );
  return context;
}

interface DeployModalStepProps extends DeployModalStep {
  isActive: boolean;
  hasCompleted: boolean;
}

const DeployModalStep: React.FC<DeployModalStepProps> = ({
  title,
  description,
  isActive,
  hasCompleted,
}) => {
  return (
    <Flex
      as={Card}
      flexDir="row"
      gap={4}
      opacity={isActive ? 1 : hasCompleted ? 0.8 : 0.3}
      align="center"
    >
      {isActive ? (
        <Center boxSize={5} flexShrink={0}>
          <Spinner size="sm" />
        </Center>
      ) : hasCompleted ? (
        <Icon as={FiCheck} color="green.500" boxSize={5} flexShrink={0} />
      ) : (
        <Icon as={FiActivity} boxSize={5} flexShrink={0} />
      )}
      <Flex flexDir="column">
        <Heading size="label.lg" mb={3}>
          {title}
        </Heading>
        <Text size="body.md">{description}</Text>
      </Flex>
    </Flex>
  );
};

export const stepDeploy: DeployModalStep = {
  title: "Deploying contract",
  description: "Your wallet will prompt you to sign the transaction.",
};

export const stepCustomChainDeploy: DeployModalStep = {
  title: "Deploying contract",
  description: (
    <>
      Your wallet will prompt you{" "}
      <i>
        <b>twice</b>
      </i>{" "}
      to sign transactions.
    </>
  ),
};

export const stepAddToRegistry: DeployModalStep = {
  title: "Adding to dashboard",
  description: (
    <>
      Your wallet will prompt you to sign the transaction.{" "}
      <i>
        This step is <b>gasless</b>.
      </i>
    </>
  ),
};
