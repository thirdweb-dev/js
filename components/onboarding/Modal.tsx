import {
  AspectRatio,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useBreakpointValue,
} from "@chakra-ui/react";
import { IconLogo } from "components/logo";
import { ComponentWithChildren } from "types/component-with-children";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  wide?: boolean;
}

export const OnboardingModal: ComponentWithChildren<OnboardingModalProps> = ({
  children,
  isOpen,
  onClose,
  wide = false,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Modal
      size={isMobile ? "full" : wide ? "3xl" : "lg"}
      closeOnEsc={false}
      allowPinchZoom
      closeOnOverlayClick={false}
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      trapFocus={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={8} as={Flex} gap={4} flexDir="column">
          <AspectRatio ratio={1} w="40px">
            <IconLogo />
          </AspectRatio>

          <Flex flexDir="column" gap={8}>
            {children}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
