import { useEditProfileMutation } from "../hooks";
import {
  Box,
  Divider,
  Flex,
  FormControl,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { ProfileMetadata, ProfileMetadataInput } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { FileInput } from "components/shared/FileInput";
import { useTrack } from "hooks/analytics/useTrack";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BiImage } from "react-icons/bi";
import { FiGlobe } from "react-icons/fi";
import { HiPencilAlt } from "react-icons/hi";
import { SiDiscord, SiGithub, SiTwitter } from "react-icons/si";
import { Button, FormErrorMessage, FormLabel, Heading } from "tw-components";

interface EditProfileProps {
  releaserProfile: ProfileMetadata;
}

export const EditProfile: React.FC<EditProfileProps> = ({
  releaserProfile,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileMetadataInput>();

  const imageUrl = useImageFileOrUrl(watch("avatar"));

  const editProfile = useEditProfileMutation();

  const { onSuccess, onError } = useTxNotifications(
    "Profile update successfully",
    "Error updating profile",
  );

  const trackEvent = useTrack();

  useEffect(() => {
    if (!isDirty) {
      reset({
        ...releaserProfile,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [releaserProfile]);

  return (
    <>
      <Button onClick={onOpen} size="sm">
        Edit Profile
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent
          mx={{ base: 4, md: 0 }}
          as="form"
          onSubmit={handleSubmit((d) => {
            trackEvent({
              category: "profile",
              action: "edit",
              label: "attempt",
            });
            editProfile.mutate(d, {
              onSuccess: () => {
                onSuccess();
                trackEvent({
                  category: "profile",
                  action: "edit",
                  label: "success",
                });
                onClose();
              },
              onError: (error) => {
                onError(error);
                trackEvent({
                  category: "profile",
                  action: "edit",
                  label: "error",
                  error,
                });
              },
            });
          })}
        >
          <ModalHeader as={Flex} alignItems="center" p={5}>
            <Heading size="title.md">Edit your profile</Heading>
            <ModalCloseButton mt={2} />
          </ModalHeader>
          <Divider mb={5} />
          <ModalBody as={Flex} flexDir="column" gap={8}>
            <FormControl isInvalid={!!errors.avatar}>
              <FormLabel>
                <Flex gap={2}>
                  <Icon as={BiImage} boxSize={4} />
                  Avatar
                </Flex>
              </FormLabel>
              <Box width={{ base: "auto", md: "250px" }}>
                <FileInput
                  accept={{ "image/*": [] }}
                  value={imageUrl}
                  showUploadButton
                  setValue={(file) => setValue("avatar", file)}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  transition="all 200ms ease"
                  _hover={{ shadow: "sm" }}
                />
              </Box>
              <FormErrorMessage>
                {errors?.avatar?.message as unknown as string}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.bio} mr={4}>
              <FormLabel>
                <Flex gap={2}>
                  <Icon as={HiPencilAlt} boxSize={4} />
                  Bio
                </Flex>
              </FormLabel>
              <Textarea
                {...register("bio")}
                autoFocus
                placeholder="Tell us about yourself"
              />
              <FormErrorMessage>{errors?.bio?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.github} mr={4}>
              <FormLabel>
                <Flex gap={2}>
                  <Icon as={SiGithub} boxSize={4} />
                  GitHub
                </Flex>
              </FormLabel>
              <Input
                {...register("github")}
                placeholder="https://github.com/yourname"
              />
              <FormErrorMessage>{errors?.github?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.twitter} mr={4}>
              <FormLabel>
                <Flex gap={2}>
                  <Icon as={SiTwitter} boxSize={4} />
                  Twitter
                </Flex>
              </FormLabel>
              <Input
                {...register("twitter")}
                placeholder="https://twitter.com/yourname"
              />
              <FormErrorMessage>{errors?.twitter?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.website} mr={4}>
              <FormLabel>
                <Flex gap={2}>
                  <Icon as={FiGlobe} boxSize={4} />
                  Website
                </Flex>
              </FormLabel>
              <Input
                {...register("website")}
                placeholder="https://yourwebsite.com"
              />
              <FormErrorMessage>{errors?.website?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.discord} mr={4}>
              <FormLabel>
                <Flex gap={2}>
                  <Icon as={SiDiscord} boxSize={4} />
                  Discord
                </Flex>
              </FormLabel>
              <Input
                {...register("discord")}
                placeholder="https://discord.gg/yourserver"
              />
              <FormErrorMessage>{errors?.discord?.message}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <TransactionButton
              transactionCount={1}
              colorScheme="blue"
              type="submit"
              isLoading={editProfile.isLoading}
            >
              Save
            </TransactionButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
