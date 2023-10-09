import { useEditProfileMutation } from "../hooks";
import {
  Box,
  Flex,
  FormControl,
  Icon,
  Input,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { SiDiscord } from "@react-icons/all-files/si/SiDiscord";
import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { SiTwitter } from "@react-icons/all-files/si/SiTwitter";
import { ProfileMetadata, ProfileMetadataInput } from "@thirdweb-dev/sdk";
import { FileInput } from "components/shared/FileInput";
import { useTrack } from "hooks/analytics/useTrack";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { BiImage } from "react-icons/bi";
import { FiEdit, FiGlobe } from "react-icons/fi";
import { HiPencilAlt } from "react-icons/hi";
import {
  Button,
  Drawer,
  FormErrorMessage,
  FormLabel,
  Heading,
} from "tw-components";
import { MaskedAvatar } from "tw-components/masked-avatar";

interface EditProfileProps {
  publisherProfile: ProfileMetadata;
}

export const EditProfile: React.FC<EditProfileProps> = ({
  publisherProfile,
}) => {
  const FORM_ID = useId();
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
        ...publisherProfile,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publisherProfile]);

  return (
    <>
      <Button
        onClick={onOpen}
        size="sm"
        variant="outline"
        leftIcon={<Icon as={FiEdit} />}
      >
        Edit Profile
      </Button>

      <form
        id={FORM_ID}
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
        <Drawer
          isOpen={isOpen}
          onClose={onClose}
          allowPinchZoom
          preserveScrollBarGap
          size="lg"
          header={{
            children: <Heading size="title.md">Edit your profile</Heading>,
          }}
          footer={{
            children: (
              <Button
                borderRadius="md"
                position="relative"
                role="group"
                colorScheme="primary"
                type="submit"
                isLoading={editProfile.isLoading}
                form={FORM_ID}
              >
                Save
              </Button>
            ),
          }}
          drawerBodyProps={{
            gap: 6,
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
          }}
        >
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
                renderPreview={(fileUrl) => (
                  <MaskedAvatar w="100%" h="100%" src={fileUrl} />
                )}
              />
            </Box>
            <FormErrorMessage>
              {errors?.avatar?.message as unknown as string}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.bio}>
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
          <FormControl isInvalid={!!errors.github}>
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
          <FormControl isInvalid={!!errors.twitter}>
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
          <FormControl isInvalid={!!errors.website}>
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
          <FormControl isInvalid={!!errors.discord}>
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
        </Drawer>
      </form>
    </>
  );
};
